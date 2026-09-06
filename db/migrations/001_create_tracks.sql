-- SQL migration for Supabase Postgres

create table if not exists public.tracks (
  id uuid primary key,
  title text,
  artist_id uuid,
  file_path text,
  file_url text,
  publisher_p_line text,
  c_line text,
  fingerprint text,
  validation_status text,
  validation_errors jsonb,
  duplicate_of uuid,
  created_at timestamptz default now(),
  processed_at timestamptz
);

create index if not exists idx_tracks_fingerprint on public.tracks using btree (fingerprint);
