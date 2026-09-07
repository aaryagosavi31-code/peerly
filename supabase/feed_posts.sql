-- Run this in Supabase Dashboard > SQL Editor.
-- The application uses custom JWT authentication, so this table is kept
-- available to the backend key used by src/lib/supabase.js.
create table if not exists public.feed_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid,
  committee_name text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  media_url text not null,
  poster_url text,
  caption text not null,
  badge text not null default 'Announcement',
  likes integer not null default 0 check (likes >= 0),
  created_at timestamptz not null default now()
);

create index if not exists feed_posts_created_at_idx
  on public.feed_posts (created_at desc);

alter table public.feed_posts enable row level security;

drop policy if exists feed_posts_public_read on public.feed_posts;
create policy feed_posts_public_read
  on public.feed_posts for select
  to anon, authenticated
  using (true);

-- Express validates the application's JWT before this insert reaches Supabase.
drop policy if exists feed_posts_backend_insert on public.feed_posts;
create policy feed_posts_backend_insert
  on public.feed_posts for insert
  to anon, authenticated
  with check (true);

create table if not exists public.feed_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.feed_posts(id) on delete cascade,
  author_id uuid,
  comment text not null,
  created_at timestamptz not null default now()
);

create index if not exists feed_comments_post_id_idx
  on public.feed_comments (post_id, created_at asc);

alter table public.feed_comments enable row level security;

drop policy if exists feed_comments_public_read on public.feed_comments;
create policy feed_comments_public_read
  on public.feed_comments for select
  to anon, authenticated
  using (true);

drop policy if exists feed_comments_backend_insert on public.feed_comments;
create policy feed_comments_backend_insert
  on public.feed_comments for insert
  to anon, authenticated
  with check (true);