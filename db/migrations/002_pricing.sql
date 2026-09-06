-- Migration: add pricing and purchases table

alter table if exists public.tracks
  add column if not exists price_cents integer default 0;

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references public.tracks(id) on delete cascade,
  stripe_session_id text,
  created_at timestamptz default now()
);
