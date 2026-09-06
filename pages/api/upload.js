import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { Queue } from 'bullmq';
import { redisConfig } from '../../src/server/redis';
import { P_LINE } from '../../src/config/site';

export const config = { api: { bodyParser: false } };

const processingQueue = new Queue('audio-processing', { connection: redisConfig });

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new multiparty.Form();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('form parse error', err);
      return res.status(500).json({ error: 'parse error' });
    }

    const file = files.file?.[0];
    if (!file) return res.status(400).json({ error: 'no file uploaded' });

    const originalName = file.originalFilename || path.basename(file.path);
    const ext = (originalName.split('.').pop() || '').toLowerCase();
    const allowed = ['wav', 'flac', 'mp3'];
    if (!allowed.includes(ext)) return res.status(400).json({ error: 'unsupported format' });

    const id = uuidv4();
    const destName = `${id}.${ext}`;

    try {
      const buffer = await fs.promises.readFile(file.path);

      // Ensure bucket 'tracks' exists in your Supabase Storage
      const { data, error: uploadErr } = await supabaseAdmin.storage.from('tracks').upload(destName, buffer, {
        contentType: file.headers && file.headers['content-type'] ? file.headers['content-type'] : undefined,
        upsert: false
      });

      if (uploadErr) {
        console.error('supabase upload error', uploadErr);
        return res.status(500).json({ error: 'storage upload failed' });
      }

      const publicUrl = supabaseAdmin.storage.from('tracks').getPublicUrl(destName).data.publicUrl;

      // Insert track row into DB (tracks table)
      const trackRow = {
        id,
        title: (fields.title && fields.title[0]) || originalName,
        artist_id: (fields.artist_id && fields.artist_id[0]) || null,
        file_path: destName,
        file_url: publicUrl,
        publisher_p_line: P_LINE,
        validation_status: 'pending',
        created_at: new Date().toISOString()
      };

      const { error: insertErr } = await supabaseAdmin.from('tracks').insert([trackRow]);
      if (insertErr) {
        console.error('db insert error', insertErr);
        return res.status(500).json({ error: 'db insert failed' });
      }

      // Enqueue background processing job
      await processingQueue.add('process-audio', { trackId: id, storagePath: destName });

      return res.status(200).json({ ok: true, trackId: id });
    } catch (e) {
      console.error('upload error', e);
      return res.status(500).json({ error: 'upload failed' });
    }
  });
}
