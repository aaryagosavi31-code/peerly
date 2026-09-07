-- Run this only if reviews are blocked by Supabase Row Level Security.
alter table public.reviews enable row level security;

drop policy if exists reviews_public_read on public.reviews;
create policy reviews_public_read
  on public.reviews for select
  to anon, authenticated
  using (coalesce(is_hidden, false) = false);

drop policy if exists reviews_backend_insert on public.reviews;
create policy reviews_backend_insert
  on public.reviews for insert
  to anon, authenticated
  with check (true);