# Maa Kantabausuni Records — Development & Deployment

This repository contains a Next.js + Supabase minimal music distribution site.

Quick setup (development)
1. Create a Supabase project and a Storage bucket named `tracks`.
2. Run the SQL in `db/migrations/001_create_tracks.sql` in your Supabase SQL editor.
3. Create a .env.local with the following placeholders:

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD= (optional)

4. Install dependencies:
   npm install

5. Start Redis (docker run -p 6379:6379 redis) or point REDIS_HOST to your Redis.
6. Install system deps for worker: ffmpeg, chromaprint (fpcalc). On mac: brew install ffmpeg chromaprint

7. Start dev server:
   npm run dev

8. Start worker in another terminal:
   npm run worker

Notes
- P-Line and C-Line are stored as code constants in src/config/site.js and are not editable via the UI.
- The upload API stores files into Supabase Storage and inserts a track row into the `tracks` table. Background processing (fingerprinting) is queued via BullMQ and Redis.

