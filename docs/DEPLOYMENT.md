Deployment notes & checklist

- Create a Supabase project and obtain NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.
- Create a Storage bucket named `tracks` and set appropriate policies.
- Deploy Next.js to Vercel. Set env variables in Vercel's dashboard.
- Run a worker process (node scripts/worker.js) on a VM/container (Render, DigitalOcean App, or a small VM). Ensure Redis is available and ffmpeg + fpcalc installed.
- Protect your repository main branch and restrict who can push to prevent accidental changes to P/C line constants.

