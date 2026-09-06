import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'missing id' });

  const { data, error } = await supabaseAdmin.from('tracks').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'not found' });

  // Generate a signed URL for streaming (1 hour expiry)
  let signedUrl = null;
  try {
    const { data: signed, error: signErr } = await supabaseAdmin.storage.from('tracks').createSignedUrl(data.file_path, 60 * 60);
    if (signErr) console.warn('signed url error', signErr);
    else signedUrl = signed.signedURL;
  } catch (e) {
    console.warn('createSignedUrl failed', e.message);
  }

  return res.status(200).json({ track: { ...data, signed_url: signedUrl } });
}
