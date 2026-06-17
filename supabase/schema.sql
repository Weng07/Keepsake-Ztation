-- Keepsake Ztation Supabase setup
-- Run this file in Supabase SQL Editor before deploying the live website.

create extension if not exists pgcrypto;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  long_description text,
  price text,
  category text default 'souvenir',
  tags text[] default '{}',
  images text[] default '{}',
  cover_image text,
  featured boolean default false,
  available boolean default true,
  messenger_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  content text,
  cover_image text,
  date date default current_date,
  author text default 'Keepsake Ztation Studio',
  tags text[] default '{}',
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('product', 'blog')),
  target_slug text not null,
  author_name text not null,
  author_email text,
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
  created_at timestamptz default now()
);

create table if not exists analytics (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_slug text not null,
  event_type text not null default 'view',
  count integer not null default 0,
  updated_at timestamptz default now(),
  unique (target_type, target_slug, event_type)
);

create table if not exists site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz default now()
);

create or replace function increment_analytics(p_target_type text, p_target_slug text, p_event_type text)
returns void
language plpgsql
as $$
begin
  insert into analytics (target_type, target_slug, event_type, count, updated_at)
  values (p_target_type, p_target_slug, p_event_type, 1, now())
  on conflict (target_type, target_slug, event_type)
  do update set count = analytics.count + 1, updated_at = now();
end;
$$;

alter table products enable row level security;
alter table blogs enable row level security;
alter table comments enable row level security;
alter table analytics enable row level security;
alter table site_settings enable row level security;

drop policy if exists "Public can read available products" on products;
create policy "Public can read available products" on products for select using (available = true);

drop policy if exists "Public can read published blogs" on blogs;
create policy "Public can read published blogs" on blogs for select using (published = true);

drop policy if exists "Public can read approved comments" on comments;
create policy "Public can read approved comments" on comments for select using (status = 'approved');

drop policy if exists "Public can read settings" on site_settings;
create policy "Public can read settings" on site_settings for select using (true);

-- Admin writes are handled by Next.js route handlers with SUPABASE_SERVICE_ROLE_KEY.
-- Keep the service role key only in Vercel/server environment variables.

insert into site_settings (key, value) values
  ('shop_name', 'Keepsake Ztation'),
  ('messenger_url', ''),
  ('facebook_url', ''),
  ('instagram_url', ''),
  ('tiktok_url', ''),
  ('contact_email', 'hello@keepsakeztation.com'),
  ('homepage_note', 'Luxury souvenirs for stories worth keeping.')
on conflict (key) do nothing;
