import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { track_id } = req.body || req.query;
  if (!track_id) return res.status(400).json({ error: 'missing track_id' });

  // Fetch track price
  const { data: track, error } = await supabaseAdmin.from('tracks').select('*').eq('id', track_id).single();
  if (error || !track) return res.status(404).json({ error: 'track not found' });

  if (!track.price_cents || track.price_cents <= 0) return res.status(400).json({ error: 'track not for sale' });

  const origin = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3000`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: { name: track.title },
          unit_amount: track.price_cents
        },
        quantity: 1
      }
    ],
    success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/track/${track_id}`,
    metadata: { track_id }
  });

  // Optionally persist a pending purchase record
  await supabaseAdmin.from('purchases').insert([{ track_id, stripe_session_id: session.id, created_at: new Date().toISOString() }]);

  return res.redirect(303, session.url);
}
