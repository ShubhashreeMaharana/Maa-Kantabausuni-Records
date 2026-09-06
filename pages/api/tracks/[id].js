import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'missing id' });

  const { data, error } = await supabaseAdmin.from('tracks').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'not found' });

  return res.status(200).json({ track: data });
}
