create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  started_at timestamp with time zone default now(),
  ended_at timestamp with time zone,
  location text,
  notes text,
  shot_count integer default 0,
  created_at timestamp with time zone default now()
);

create table public.shots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  session_id uuid references public.sessions(id) on delete cascade,
  transcript text not null,
  whisper_response text,
  created_at timestamp with time zone default now()
);

alter table public.sessions enable row level security;
alter table public.shots enable row level security;

create policy "users own their sessions" on public.sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users own their shots" on public.shots
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index idx_shots_session on public.shots(session_id, created_at desc);
create index idx_shots_user on public.shots(user_id, created_at desc);
create index idx_sessions_user on public.sessions(user_id, started_at desc);
