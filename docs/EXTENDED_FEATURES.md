# Additional deployment & integration notes

This file documents how to enable the extra features implemented: secure streaming (signed URLs), Stripe payments, and AcoustID duplicate detection.

1) Secure streaming (signed URLs)
- The upload pipeline now stores files in Supabase Storage without creating a public URL. The track read API (`/api/tracks/[id]`) generates a signed URL valid for 1 hour. Ensure your Supabase bucket `tracks` is set to private.
- Environment variables required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (already used by server).

2) Stripe payments
- Add these environment variables:
  - STRIPE_SECRET_KEY (your Stripe secret key)
  - STRIPE_WEBHOOK_SECRET (the webhook signing secret if you configure webhooks)
  - NEXT_PUBLIC_BASE_URL (optional, for checkout redirect URLs)
- The site adds a `price_cents` integer column to tracks. When uploading, you can include `price_cents` in the upload form.
- The Checkout session is created server-side and redirects user to Stripe Checkout. Webhook `/api/stripe-webhook` processes `checkout.session.completed` events and records purchases into `purchases` table.

3) AcoustID
- To enable robust duplicate detection, set ACOUSTID_API_KEY in your worker host environment. The worker will call the AcoustID lookup API after generating the Chromaprint fingerprint.
- You must install Chromaprint (`fpcalc`) and ffmpeg on the worker host.

4) i18n (Hindi / English)
- A minimal client-side language toggle is included in the header. Strings are in `src/i18n.js`. This is a lightweight approach; for full translations consider a proper i18n library.

5) Running worker in production
- Worker requires Node, access to Redis, and ffmpeg + fpcalc installed.
- Ensure environment variables are available to the worker process (SUPABASE_SERVICE_ROLE_KEY, ACOUSTID_API_KEY, REDIS_*)

