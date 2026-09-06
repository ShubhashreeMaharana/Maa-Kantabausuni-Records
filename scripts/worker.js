import { Worker } from 'bullmq';
import util from 'util';
import { execFile } from 'child_process';
import mm from 'music-metadata';
import fs from 'fs';
import fetch from 'node-fetch';
import { redisConfig } from '../src/server/redis';

const execFileP = util.promisify(execFile);

const ACOUSTID_KEY = process.env.ACOUSTID_API_KEY; // set this in env for AcoustID lookup

const worker = new Worker('audio-processing', async job => {
  const { trackId, storagePath } = job.data;
  console.log('Processing track', trackId, storagePath);

  // Download file from Supabase storage to local temp (requires service role key and bucket 'tracks')
  const tmpPath = `/tmp/${storagePath}`;
  try {
    // If file already present, skip download. In production, fetch from storage using signed URL or supabase client
    // This script assumes worker host can access Supabase via service role key if needed.
  } catch (e) {
    console.warn('download step skipped — implement if needed', e.message);
  }

  // 1) metadata extraction
  let metadata = null;
  const missing = [];
  try {
    metadata = await mm.parseFile(tmpPath, { duration: true });
    if (!metadata.common.title) missing.push('title');
    if (!metadata.common.artist) missing.push('artist');
  } catch (e) {
    console.warn('metadata parse failed', e.message);
    missing.push('metadata_parse_failed');
  }

  // 2) ffprobe check for container/codec/duration
  let ffprobeInfo = null;
  try {
    const { stdout } = await execFileP('ffprobe', ['-v', 'error', '-show_entries', 'format=format_name,duration', '-of', 'json', tmpPath]);
    ffprobeInfo = JSON.parse(stdout);
  } catch (e) {
    console.warn('ffprobe failed', e.message);
    missing.push('ffprobe_failed');
  }

  // 3) Chromaprint fingerprint (fpcalc must be installed on worker host)
  let fingerprint = null;
  let duration = null;
  try {
    const { stdout } = await execFileP('fpcalc', ['-json', tmpPath]);
    const fpObj = JSON.parse(stdout);
    fingerprint = fpObj.fingerprint;
    duration = fpObj.duration;
  } catch (e) {
    console.warn('fpcalc failed (is chromaprint installed?)', e.message);
    // not fatal — continue
  }

  // 4) AcoustID lookup for duplicate detection
  let duplicateOf = null;
  if (fingerprint && ACOUSTID_KEY) {
    try {
      const params = new URLSearchParams({ client: ACOUSTID_KEY, fingerprint, duration: String(duration), meta: 'recordings' });
      const url = `https://api.acoustid.org/v2/lookup?${params.toString()}`;
      const resp = await fetch(url);
      const j = await resp.json();
      if (j.status === 'ok' && j.results && j.results.length) {
        // AcoustID returns scores — high score likely a match
        const top = j.results[0];
        if (top.score && top.score >= 0.9) {
          // For robust mapping we'd need mapping between AcoustID and our tracks; here we flag duplicate based on presence
          duplicateOf = top.recordings && top.recordings[0] && top.recordings[0].id ? top.recordings[0].id : null;
        }
      }
    } catch (e) {
      console.warn('AcoustID lookup failed', e.message);
    }
  }

  // 5) Update DB with results (pseudo-code)
  const validationStatus = missing.length || duplicateOf ? (duplicateOf ? 'duplicate' : 'failed') : 'ok';
  const validationErrors = missing;
  const processedAt = new Date().toISOString();

  // TODO: replace below with your DB update logic (Supabase client or direct DB)
  console.log('Result', { trackId, validationStatus, validationErrors, duplicateOf });

  // Optionally remove local temp file
  try {
    await fs.promises.unlink(tmpPath);
  } catch (e) {
    // ignore
  }

  return { validationStatus, validationErrors, duplicateOf };
}, { connection: redisConfig });

worker.on('completed', (job, result) => {
  console.log('job completed', job.id, result);
});

worker.on('failed', (job, err) => {
  console.error('job failed', job.id, err);
});
