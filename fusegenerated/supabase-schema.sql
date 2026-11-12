-- Run in Supabase SQL Editor. Enable email sign-in under Authentication.
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 username text not null unique check (username ~ '^[a-z0-9_]{3,24}$'),
 display_name text not null check (char_length(display_name) between 1 and 80),
 school text not null default '' check (char_length(school) <= 100),
 bio text not null default '' check (char_length(bio) <= 250),
 created_at timestamptz not null default now()
);
create table if not exists public.friendships (
 id bigint generated always as identity primary key,
 requester uuid not null references public.profiles(id) on delete cascade,
 recipient uuid not null references public.profiles(id) on delete cascade,
 status text not null default 'pending' check(status in ('pending','accepted')),
 created_at timestamptz not null default now(),
 check (requester <> recipient)
);
create unique index if not exists friendships_pair_unique on public.friendships(least(requester,recipient),greatest(requester,recipient));
create index if not exists friendships_recipient_index on public.friendships(recipient);
alter table public.profiles enable row level security;
alter table public.friendships enable row level security;
create policy "Signed-in people can discover profiles" on public.profiles for select to authenticated using (true);
create policy "Users create their own profile" on public.profiles for insert to authenticated with check (id = (select auth.uid()));
create policy "Users update their own profile" on public.profiles for update to authenticated using (id = (select auth.uid())) with check(id = (select auth.uid()));
create policy "Friendship participants may read" on public.friendships for select to authenticated using(requester = (select auth.uid()) or recipient = (select auth.uid()));
create policy "Sender requests friendship" on public.friendships for insert to authenticated with check(requester = (select auth.uid()) and status = 'pending');
create policy "Recipient accepts request" on public.friendships for update to authenticated using(recipient = (select auth.uid()) and status = 'pending') with check(recipient = (select auth.uid()) and status = 'accepted');
create policy "Either participant may unfriend" on public.friendships for delete to authenticated using(requester = (select auth.uid()) or recipient = (select auth.uid()));
-- Do not put the Supabase service_role key in the frontend or Vercel environment for this app.

-- Allow request recipients to change only the status column, not requester/recipient IDs.
revoke update on public.friendships from authenticated;
grant update(status) on public.friendships to authenticated;
