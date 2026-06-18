import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Returns a live Supabase client if env vars are set, otherwise null.
// The app falls back to localStorage when supabase is null.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseEnabled = Boolean(supabase)

/*
  ─── SUPABASE SCHEMA ────────────────────────────────────────────────────────
  Run this SQL in your Supabase project → SQL Editor to create the tables.

  create table inquiries (
    id          uuid primary key default gen_random_uuid(),
    name        text not null,
    company     text,
    email       text not null,
    type        text,
    message     text,
    status      text default 'new',
    notes       text default '',
    read_at     timestamptz,
    created_at  timestamptz default now()
  );

  create table demo_requests (
    id          uuid primary key default gen_random_uuid(),
    name        text not null,
    email       text not null,
    product     text,
    source      text,
    status      text default 'new',
    created_at  timestamptz default now()
  );

  create table projects (
    id          uuid primary key default gen_random_uuid(),
    name        text not null,
    client      text,
    status      text default 'active',
    budget      text,
    notes       text default '',
    created_at  timestamptz default now()
  );

  -- Enable Row Level Security (RLS) and add policies for your admin role.
  alter table inquiries    enable row level security;
  alter table demo_requests enable row level security;
  alter table projects     enable row level security;
  ─────────────────────────────────────────────────────────────────────────── */
