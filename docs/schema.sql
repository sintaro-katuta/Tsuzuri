-- Tabiori-Scrap Database Schema

-- 1. Create Trips Table
create table trips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  start_date date,
  end_date date,
  share_id uuid default gen_random_uuid() not null unique, -- URL共有用ID
  owner_id uuid references auth.users(id) not null,
  created_at timestamptz default now()
);

-- RLS: MVP - Allow access to authenticated users (Logic controlled by app/share_id)
alter table trips enable row level security;
create policy "Allow all authenticated access" on trips
  for all using (auth.role() = 'authenticated');

-- 2. Create Timeline Items Table
create table timeline_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade not null,
  type text not null check (type in ('PLAN', 'PHOTO')),
  
  -- Common Fields
  title text, -- PLAN: Title, PHOTO: Caption/Comment
  time timestamptz not null, -- Scheduled time or Taken/Posted time
  memo text,
  
  -- PLAN specific
  link_url text, -- Google Map URL
  is_completed boolean default false,
  
  -- PHOTO specific
  photo_path text, -- Supabase Storage Path
  
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- RLS
alter table timeline_items enable row level security;
create policy "Allow all authenticated access" on timeline_items
  for all using (auth.role() = 'authenticated');

-- 3. Storage Bucket Setup (Instructions)
-- Create a public bucket named 'trip-photos' in Supabase Dashboard.
-- Policy: Generic "Authenticated users can upload" and "Public can read".
