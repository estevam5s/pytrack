-- ═══════════════════════════════════════════════════════════════════
-- PyTrack · Comunidade — schema completo (tabelas, índices, RLS, triggers)
-- Aplicar via scripts/apply-community-schema.ts ou no SQL Editor do Supabase.
-- Idempotente: pode ser reexecutado.
-- ═══════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────── Tabelas ─────────────────

create table if not exists public.community_profiles (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  username     text unique,
  bio          text,
  avatar_url   text,
  headline     text,
  current_track text,
  level        text not null default 'Iniciante',
  xp           int  not null default 0,
  github_url   text,
  linkedin_url text,
  portfolio_url text,
  is_online    boolean not null default false,
  last_seen_at timestamptz default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.community_posts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  category      text not null default 'discussao',
  title         text,
  content       text not null,
  image_urls    text[] not null default '{}',
  tags          text[] not null default '{}',
  visibility    text not null default 'public',
  status        text not null default 'active',
  likes_count   int not null default 0,
  comments_count int not null default 0,
  shares_count  int not null default 0,
  saves_count   int not null default 0,
  reports_count int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint community_posts_category_chk check (category in
    ('duvida','exercicio','projeto','vaga','material','conquista','discussao','artigo','evento')),
  constraint community_posts_visibility_chk check (visibility in ('public','members','private')),
  constraint community_posts_status_chk check (status in ('active','hidden','deleted','reported')),
  constraint community_posts_content_len_chk check (char_length(content) <= 5000)
);

create table if not exists public.community_comments (
  id                uuid primary key default gen_random_uuid(),
  post_id           uuid not null references public.community_posts(id) on delete cascade,
  user_id           uuid not null references auth.users(id) on delete cascade,
  parent_comment_id uuid references public.community_comments(id) on delete cascade,
  content           text not null,
  likes_count       int not null default 0,
  is_solution       boolean not null default false,
  status            text not null default 'active',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint community_comments_status_chk check (status in ('active','hidden','deleted')),
  constraint community_comments_len_chk check (char_length(content) <= 2000)
);

create table if not exists public.community_likes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  post_id     uuid references public.community_posts(id) on delete cascade,
  comment_id  uuid references public.community_comments(id) on delete cascade,
  target_type text not null,
  created_at  timestamptz not null default now(),
  constraint community_likes_target_chk check (target_type in ('post','comment')),
  constraint community_likes_one_target_chk check (
    (post_id is not null and comment_id is null) or
    (post_id is null and comment_id is not null))
);
create unique index if not exists community_likes_post_uniq
  on public.community_likes(user_id, post_id) where post_id is not null;
create unique index if not exists community_likes_comment_uniq
  on public.community_likes(user_id, comment_id) where comment_id is not null;

create table if not exists public.community_saved_posts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  post_id    uuid not null references public.community_posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, post_id)
);

create table if not exists public.community_follows (
  id           uuid primary key default gen_random_uuid(),
  follower_id  uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  unique (follower_id, following_id),
  constraint community_no_self_follow check (follower_id <> following_id)
);

create table if not exists public.community_post_shares (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  post_id    uuid not null references public.community_posts(id) on delete cascade,
  message    text,
  created_at timestamptz not null default now()
);

create table if not exists public.community_reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  post_id     uuid references public.community_posts(id) on delete cascade,
  comment_id  uuid references public.community_comments(id) on delete cascade,
  reason      text not null,
  description text,
  status      text not null default 'pending',
  created_at  timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint community_reports_reason_chk check (reason in
    ('spam','abuse','offensive','misinformation','other')),
  constraint community_reports_status_chk check (status in ('pending','reviewed','dismissed'))
);

create table if not exists public.community_jobs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null,
  company       text not null,
  location      text,
  remote        boolean not null default false,
  contract_type text,
  seniority     text,
  salary_range  text,
  description   text,
  requirements  text[],
  apply_url     text,
  tags          text[] not null default '{}',
  status        text not null default 'open',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint community_jobs_status_chk check (status in ('open','closed'))
);

create table if not exists public.community_notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  actor_id   uuid references auth.users(id) on delete cascade,
  type       text not null,
  post_id    uuid references public.community_posts(id) on delete cascade,
  comment_id uuid references public.community_comments(id) on delete cascade,
  message    text,
  read       boolean not null default false,
  created_at timestamptz not null default now(),
  constraint community_notif_type_chk check (type in
    ('like','comment','reply','follow','solution','mention','job'))
);

-- ───────────────────────────────────────── Índices ─────────────────
create index if not exists idx_posts_created     on public.community_posts(created_at desc);
create index if not exists idx_posts_category    on public.community_posts(category);
create index if not exists idx_posts_user        on public.community_posts(user_id);
create index if not exists idx_posts_status      on public.community_posts(status);
create index if not exists idx_comments_post     on public.community_comments(post_id, created_at);
create index if not exists idx_likes_post        on public.community_likes(post_id);
create index if not exists idx_saved_user        on public.community_saved_posts(user_id);
create index if not exists idx_follows_following on public.community_follows(following_id);
create index if not exists idx_follows_follower  on public.community_follows(follower_id);
create index if not exists idx_jobs_created      on public.community_jobs(created_at desc);
create index if not exists idx_notif_user        on public.community_notifications(user_id, read, created_at desc);
create index if not exists idx_profiles_xp       on public.community_profiles(xp desc);

-- ───────────────────────────────── Funções utilitárias ─────────────

create or replace function public.community_touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- nível a partir do XP
create or replace function public.community_level_from_xp(xp int)
returns text language sql immutable as $$
  select case
    when xp >= 5000 then 'Mentor Python'
    when xp >= 3200 then 'Software Engineer'
    when xp >= 2000 then 'Data Engineer'
    when xp >= 1200 then 'IoT Maker'
    when xp >= 700  then 'Backend Builder'
    when xp >= 350  then 'Data Apprentice'
    when xp >= 150  then 'Python Developer'
    when xp >= 50   then 'Explorador Python'
    else 'Iniciante'
  end;
$$;

-- garante a existência do community_profile do usuário
create or replace function public.community_ensure_profile(uid uuid)
returns void language plpgsql security definer set search_path = public as $$
declare nm text; av text;
begin
  if exists (select 1 from public.community_profiles where user_id = uid) then return; end if;
  select coalesce(name, split_part(email,'@',1)), avatar_url into nm, av
    from public.users_profile where user_id = uid;
  insert into public.community_profiles (user_id, display_name, username, avatar_url)
  values (uid, coalesce(nm,'Estudante Python'),
          'user_' || left(replace(uid::text,'-',''),10), av)
  on conflict (user_id) do nothing;
end; $$;

-- adiciona XP e recalcula nível
create or replace function public.community_add_xp(uid uuid, amount int)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.community_ensure_profile(uid);
  update public.community_profiles
     set xp = greatest(0, xp + amount),
         level = public.community_level_from_xp(greatest(0, xp + amount)),
         updated_at = now()
   where user_id = uid;
end; $$;

-- cria notificação (evita auto-notificação)
create or replace function public.community_notify(
  target uuid, actor uuid, ntype text, pid uuid, cid uuid, msg text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if target is null or target = actor then return; end if;
  insert into public.community_notifications (user_id, actor_id, type, post_id, comment_id, message)
  values (target, actor, ntype, pid, cid, msg);
end; $$;

-- ─────────────────────────────── Triggers de contadores ────────────

create or replace function public.community_like_counts()
returns trigger language plpgsql security definer set search_path = public as $$
declare owner uuid;
begin
  if (tg_op = 'INSERT') then
    if new.target_type = 'post' then
      update public.community_posts set likes_count = likes_count + 1 where id = new.post_id
        returning user_id into owner;
      perform public.community_add_xp(owner, 2);
      perform public.community_notify(owner, new.user_id, 'like', new.post_id, null, 'curtiu sua publicação');
    else
      update public.community_comments set likes_count = likes_count + 1 where id = new.comment_id
        returning user_id into owner;
      perform public.community_add_xp(owner, 1);
    end if;
    return new;
  elsif (tg_op = 'DELETE') then
    if old.target_type = 'post' then
      update public.community_posts set likes_count = greatest(0, likes_count - 1) where id = old.post_id;
    else
      update public.community_comments set likes_count = greatest(0, likes_count - 1) where id = old.comment_id;
    end if;
    return old;
  end if;
  return null;
end; $$;
drop trigger if exists trg_like_counts on public.community_likes;
create trigger trg_like_counts after insert or delete on public.community_likes
  for each row execute function public.community_like_counts();

create or replace function public.community_comment_counts()
returns trigger language plpgsql security definer set search_path = public as $$
declare post_owner uuid; parent_owner uuid;
begin
  if (tg_op = 'INSERT') then
    update public.community_posts set comments_count = comments_count + 1 where id = new.post_id
      returning user_id into post_owner;
    perform public.community_add_xp(new.user_id, 5);
    if new.parent_comment_id is not null then
      select user_id into parent_owner from public.community_comments where id = new.parent_comment_id;
      perform public.community_notify(parent_owner, new.user_id, 'reply', new.post_id, new.id, 'respondeu seu comentário');
    else
      perform public.community_notify(post_owner, new.user_id, 'comment', new.post_id, new.id, 'comentou na sua publicação');
    end if;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.community_posts set comments_count = greatest(0, comments_count - 1) where id = old.post_id;
    return old;
  end if;
  return null;
end; $$;
drop trigger if exists trg_comment_counts on public.community_comments;
create trigger trg_comment_counts after insert or delete on public.community_comments
  for each row execute function public.community_comment_counts();

create or replace function public.community_save_counts()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (tg_op = 'INSERT') then
    update public.community_posts set saves_count = saves_count + 1 where id = new.post_id; return new;
  elsif (tg_op = 'DELETE') then
    update public.community_posts set saves_count = greatest(0, saves_count - 1) where id = old.post_id; return old;
  end if; return null;
end; $$;
drop trigger if exists trg_save_counts on public.community_saved_posts;
create trigger trg_save_counts after insert or delete on public.community_saved_posts
  for each row execute function public.community_save_counts();

create or replace function public.community_share_counts()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.community_posts set shares_count = shares_count + 1 where id = new.post_id; return new;
end; $$;
drop trigger if exists trg_share_counts on public.community_post_shares;
create trigger trg_share_counts after insert on public.community_post_shares
  for each row execute function public.community_share_counts();

create or replace function public.community_report_counts()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.post_id is not null then
    update public.community_posts set reports_count = reports_count + 1 where id = new.post_id;
  end if; return new;
end; $$;
drop trigger if exists trg_report_counts on public.community_reports;
create trigger trg_report_counts after insert on public.community_reports
  for each row execute function public.community_report_counts();

create or replace function public.community_follow_notify()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.community_add_xp(new.following_id, 3);
  perform public.community_notify(new.following_id, new.follower_id, 'follow', null, null, 'começou a seguir você');
  return new;
end; $$;
drop trigger if exists trg_follow_notify on public.community_follows;
create trigger trg_follow_notify after insert on public.community_follows
  for each row execute function public.community_follow_notify();

create or replace function public.community_post_xp()
returns trigger language plpgsql security definer set search_path = public as $$
begin perform public.community_add_xp(new.user_id, 10); return new; end; $$;
drop trigger if exists trg_post_xp on public.community_posts;
create trigger trg_post_xp after insert on public.community_posts
  for each row execute function public.community_post_xp();

create or replace function public.community_solution_xp()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.is_solution and not old.is_solution then
    perform public.community_add_xp(new.user_id, 30);
    perform public.community_notify(new.user_id, auth.uid(), 'solution', new.post_id, new.id, 'marcou seu comentário como solução');
  end if; return new;
end; $$;
drop trigger if exists trg_solution_xp on public.community_comments;
create trigger trg_solution_xp after update on public.community_comments
  for each row execute function public.community_solution_xp();

-- updated_at
drop trigger if exists trg_touch_profiles on public.community_profiles;
create trigger trg_touch_profiles before update on public.community_profiles
  for each row execute function public.community_touch_updated_at();
drop trigger if exists trg_touch_posts on public.community_posts;
create trigger trg_touch_posts before update on public.community_posts
  for each row execute function public.community_touch_updated_at();
drop trigger if exists trg_touch_comments on public.community_comments;
create trigger trg_touch_comments before update on public.community_comments
  for each row execute function public.community_touch_updated_at();
drop trigger if exists trg_touch_jobs on public.community_jobs;
create trigger trg_touch_jobs before update on public.community_jobs
  for each row execute function public.community_touch_updated_at();

-- ───────────────────────────────────────── RLS ─────────────────────

alter table public.community_profiles    enable row level security;
alter table public.community_posts        enable row level security;
alter table public.community_comments     enable row level security;
alter table public.community_likes        enable row level security;
alter table public.community_saved_posts  enable row level security;
alter table public.community_follows      enable row level security;
alter table public.community_post_shares  enable row level security;
alter table public.community_reports      enable row level security;
alter table public.community_jobs         enable row level security;
alter table public.community_notifications enable row level security;

-- profiles
drop policy if exists cp_select on public.community_profiles;
create policy cp_select on public.community_profiles for select to authenticated using (true);
drop policy if exists cp_insert on public.community_profiles;
create policy cp_insert on public.community_profiles for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists cp_update on public.community_profiles;
create policy cp_update on public.community_profiles for update to authenticated using (auth.uid() = user_id);

-- posts
drop policy if exists posts_select on public.community_posts;
create policy posts_select on public.community_posts for select to authenticated
  using (status = 'active' or user_id = auth.uid());
drop policy if exists posts_insert on public.community_posts;
create policy posts_insert on public.community_posts for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists posts_update on public.community_posts;
create policy posts_update on public.community_posts for update to authenticated using (auth.uid() = user_id);

-- comments
drop policy if exists comments_select on public.community_comments;
create policy comments_select on public.community_comments for select to authenticated using (true);
drop policy if exists comments_insert on public.community_comments;
create policy comments_insert on public.community_comments for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists comments_update on public.community_comments;
create policy comments_update on public.community_comments for update to authenticated
  using (auth.uid() = user_id or auth.uid() = (select user_id from public.community_posts p where p.id = post_id));

-- likes
drop policy if exists likes_select on public.community_likes;
create policy likes_select on public.community_likes for select to authenticated using (true);
drop policy if exists likes_insert on public.community_likes;
create policy likes_insert on public.community_likes for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists likes_delete on public.community_likes;
create policy likes_delete on public.community_likes for delete to authenticated using (auth.uid() = user_id);

-- saved
drop policy if exists saved_all on public.community_saved_posts;
create policy saved_all on public.community_saved_posts for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- follows
drop policy if exists follows_select on public.community_follows;
create policy follows_select on public.community_follows for select to authenticated using (true);
drop policy if exists follows_insert on public.community_follows;
create policy follows_insert on public.community_follows for insert to authenticated
  with check (auth.uid() = follower_id and follower_id <> following_id);
drop policy if exists follows_delete on public.community_follows;
create policy follows_delete on public.community_follows for delete to authenticated using (auth.uid() = follower_id);

-- shares
drop policy if exists shares_select on public.community_post_shares;
create policy shares_select on public.community_post_shares for select to authenticated using (true);
drop policy if exists shares_insert on public.community_post_shares;
create policy shares_insert on public.community_post_shares for insert to authenticated with check (auth.uid() = user_id);

-- reports
drop policy if exists reports_insert on public.community_reports;
create policy reports_insert on public.community_reports for insert to authenticated with check (auth.uid() = reporter_id);
drop policy if exists reports_select on public.community_reports;
create policy reports_select on public.community_reports for select to authenticated using (auth.uid() = reporter_id);

-- jobs
drop policy if exists jobs_select on public.community_jobs;
create policy jobs_select on public.community_jobs for select to authenticated using (true);
drop policy if exists jobs_insert on public.community_jobs;
create policy jobs_insert on public.community_jobs for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists jobs_update on public.community_jobs;
create policy jobs_update on public.community_jobs for update to authenticated using (auth.uid() = user_id);

-- notifications
drop policy if exists notif_select on public.community_notifications;
create policy notif_select on public.community_notifications for select to authenticated using (auth.uid() = user_id);
drop policy if exists notif_update on public.community_notifications;
create policy notif_update on public.community_notifications for update to authenticated using (auth.uid() = user_id);

-- ───────────────────────────────── Storage bucket ──────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('community-post-images', 'community-post-images', true, 5242880,
        array['image/jpeg','image/jpg','image/png','image/webp'])
on conflict (id) do update
  set public = true, file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg','image/jpg','image/png','image/webp'];

drop policy if exists "community images read" on storage.objects;
create policy "community images read" on storage.objects for select
  using (bucket_id = 'community-post-images');
drop policy if exists "community images insert" on storage.objects;
create policy "community images insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'community-post-images' and owner = auth.uid());
drop policy if exists "community images delete" on storage.objects;
create policy "community images delete" on storage.objects for delete to authenticated
  using (bucket_id = 'community-post-images' and owner = auth.uid());

-- ───────────────────────────────── Realtime ───────────────────────
do $$ begin
  alter publication supabase_realtime add table public.community_posts;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.community_comments;
exception when duplicate_object then null; end $$;

-- recarrega o schema do PostgREST
notify pgrst, 'reload schema';
