-- PrepOS initial schema
-- Based on docs/05_Database.md

create extension if not exists pgcrypto;

create type public.task_status as enum ('pending', 'in_progress', 'completed', 'skipped');
create type public.mistake_type as enum ('concept', 'calculation', 'silly', 'time_management');
create type public.error_status as enum ('open', 'reviewing', 'resolved');
create type public.notification_type as enum ('planner', 'reminder', 'mock', 'streak', 'revision', 'system');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  target_exam text,
  target_score integer check (target_score is null or target_score >= 0),
  exam_date date,
  timezone text,
  daily_study_goal_hours numeric(5,2) check (daily_study_goal_hours is null or daily_study_goal_hours >= 0),
  college_schedule jsonb not null default '{}'::jsonb,
  gym_schedule jsonb not null default '{}'::jsonb,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.daily_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  subject text,
  topic text,
  subtopic text,
  priority smallint not null default 3 check (priority between 1 and 5),
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes >= 0),
  actual_minutes integer not null default 0 check (actual_minutes >= 0),
  due_date timestamptz,
  reminder_time timestamptz,
  status public.task_status not null default 'pending',
  recurrence_rule text,
  notes text,
  attachment_count integer not null default 0 check (attachment_count >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references public.daily_tasks(id) on delete set null,
  subject text,
  topic text,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  topic text,
  subtopic text,
  completion_percentage numeric(5,2) not null default 0 check (completion_percentage between 0 and 100),
  mastery_percentage numeric(5,2) not null default 0 check (mastery_percentage between 0 and 100),
  questions_solved integer not null default 0 check (questions_solved >= 0),
  correct_answers integer not null default 0 check (correct_answers >= 0),
  incorrect_answers integer not null default 0 check (incorrect_answers >= 0),
  revision_count integer not null default 0 check (revision_count >= 0),
  last_revision_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.knowledge_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null default '',
  subject text,
  topic text,
  subtopic text,
  tags text[] not null default '{}',
  is_formula boolean not null default false,
  is_bookmarked boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  note_id uuid references public.knowledge_notes(id) on delete set null,
  front text not null,
  back text not null,
  difficulty smallint not null default 2 check (difficulty between 1 and 3),
  next_review timestamptz,
  review_interval integer not null default 1 check (review_interval >= 0),
  repetitions integer not null default 0 check (repetitions >= 0),
  ease_factor numeric(4,2) not null default 2.50 check (ease_factor >= 1.30),
  last_review timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  storage_path text not null unique,
  mime_type text not null,
  size bigint not null check (size >= 0),
  linked_table text,
  linked_record_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.error_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text,
  topic text,
  subtopic text,
  question_title text,
  mistake_type public.mistake_type not null,
  difficulty smallint check (difficulty is null or difficulty between 1 and 5),
  explanation text,
  correct_solution text,
  screenshot_attachment_id uuid references public.attachments(id) on delete set null,
  review_date date,
  revision_count integer not null default 0 check (revision_count >= 0),
  status public.error_status not null default 'open',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.mock_tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mock_name text not null,
  provider text,
  test_date date,
  total_score numeric(7,2),
  percentile numeric(5,2) check (percentile is null or (percentile >= 0 and percentile <= 100)),
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  overall_accuracy numeric(5,2) check (overall_accuracy is null or (overall_accuracy >= 0 and overall_accuracy <= 100)),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.mock_sections (
  id uuid primary key default gen_random_uuid(),
  mock_test_id uuid not null references public.mock_tests(id) on delete cascade,
  section_name text not null,
  attempts integer not null default 0 check (attempts >= 0),
  correct integer not null default 0 check (correct >= 0),
  incorrect integer not null default 0 check (incorrect >= 0),
  skipped integer not null default 0 check (skipped >= 0),
  score numeric(7,2),
  accuracy numeric(5,2) check (accuracy is null or (accuracy >= 0 and accuracy <= 100)),
  time_spent_minutes integer check (time_spent_minutes is null or time_spent_minutes >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type public.notification_type not null,
  is_read boolean not null default false,
  scheduled_for timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.roadmap (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  roadmap_version integer not null default 1,
  start_date date,
  end_date date,
  roadmap_json jsonb not null default '{}'::jsonb,
  generated_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  theme text,
  accent_color text,
  notifications_enabled boolean not null default true,
  push_enabled boolean not null default false,
  language text not null default 'en',
  first_day_of_week smallint not null default 1 check (first_day_of_week between 0 and 6),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_name text not null,
  achievement_key text not null,
  unlocked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, achievement_key)
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index idx_profiles_user_id on public.profiles(user_id);
create index idx_daily_tasks_user_id on public.daily_tasks(user_id);
create index idx_daily_tasks_due_date on public.daily_tasks(due_date);
create index idx_daily_tasks_subject on public.daily_tasks(subject);
create index idx_daily_tasks_topic on public.daily_tasks(topic);
create index idx_daily_tasks_status on public.daily_tasks(status);
create index idx_study_sessions_user_id on public.study_sessions(user_id);
create index idx_study_sessions_task_id on public.study_sessions(task_id);
create index idx_progress_user_id on public.progress(user_id);
create index idx_progress_subject on public.progress(subject);
create index idx_progress_topic on public.progress(topic);
create index idx_knowledge_notes_user_id on public.knowledge_notes(user_id);
create index idx_knowledge_notes_subject on public.knowledge_notes(subject);
create index idx_knowledge_notes_topic on public.knowledge_notes(topic);
create index idx_flashcards_user_id on public.flashcards(user_id);
create index idx_flashcards_next_review on public.flashcards(next_review);
create index idx_error_logs_user_id on public.error_logs(user_id);
create index idx_error_logs_subject on public.error_logs(subject);
create index idx_error_logs_topic on public.error_logs(topic);
create index idx_error_logs_review_date on public.error_logs(review_date);
create index idx_mock_tests_user_id on public.mock_tests(user_id);
create index idx_mock_tests_test_date on public.mock_tests(test_date);
create index idx_mock_sections_mock_test_id on public.mock_sections(mock_test_id);
create index idx_attachments_user_id on public.attachments(user_id);
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_scheduled_for on public.notifications(scheduled_for);
create index idx_roadmap_user_id on public.roadmap(user_id);
create index idx_settings_user_id on public.settings(user_id);
create index idx_achievements_user_id on public.achievements(user_id);
create index idx_activity_logs_user_id on public.activity_logs(user_id);

create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_daily_tasks_updated_at before update on public.daily_tasks for each row execute function public.set_updated_at();
create trigger trg_study_sessions_updated_at before update on public.study_sessions for each row execute function public.set_updated_at();
create trigger trg_progress_updated_at before update on public.progress for each row execute function public.set_updated_at();
create trigger trg_knowledge_notes_updated_at before update on public.knowledge_notes for each row execute function public.set_updated_at();
create trigger trg_flashcards_updated_at before update on public.flashcards for each row execute function public.set_updated_at();
create trigger trg_attachments_updated_at before update on public.attachments for each row execute function public.set_updated_at();
create trigger trg_error_logs_updated_at before update on public.error_logs for each row execute function public.set_updated_at();
create trigger trg_mock_tests_updated_at before update on public.mock_tests for each row execute function public.set_updated_at();
create trigger trg_mock_sections_updated_at before update on public.mock_sections for each row execute function public.set_updated_at();
create trigger trg_notifications_updated_at before update on public.notifications for each row execute function public.set_updated_at();
create trigger trg_roadmap_updated_at before update on public.roadmap for each row execute function public.set_updated_at();
create trigger trg_settings_updated_at before update on public.settings for each row execute function public.set_updated_at();
create trigger trg_achievements_updated_at before update on public.achievements for each row execute function public.set_updated_at();
create trigger trg_activity_logs_updated_at before update on public.activity_logs for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.daily_tasks enable row level security;
alter table public.study_sessions enable row level security;
alter table public.progress enable row level security;
alter table public.knowledge_notes enable row level security;
alter table public.flashcards enable row level security;
alter table public.error_logs enable row level security;
alter table public.mock_tests enable row level security;
alter table public.mock_sections enable row level security;
alter table public.attachments enable row level security;
alter table public.notifications enable row level security;
alter table public.roadmap enable row level security;
alter table public.settings enable row level security;
alter table public.achievements enable row level security;
alter table public.activity_logs enable row level security;

create policy "profiles_user_isolation" on public.profiles
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "daily_tasks_user_isolation" on public.daily_tasks
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "study_sessions_user_isolation" on public.study_sessions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "progress_user_isolation" on public.progress
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "knowledge_notes_user_isolation" on public.knowledge_notes
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "flashcards_user_isolation" on public.flashcards
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "error_logs_user_isolation" on public.error_logs
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "mock_tests_user_isolation" on public.mock_tests
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "mock_sections_user_isolation" on public.mock_sections
for all
using (
  exists (
    select 1
    from public.mock_tests mt
    where mt.id = mock_sections.mock_test_id and mt.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.mock_tests mt
    where mt.id = mock_sections.mock_test_id and mt.user_id = auth.uid()
  )
);

create policy "attachments_user_isolation" on public.attachments
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "notifications_user_isolation" on public.notifications
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "roadmap_user_isolation" on public.roadmap
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "settings_user_isolation" on public.settings
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "achievements_user_isolation" on public.achievements
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "activity_logs_user_isolation" on public.activity_logs
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'uploads',
  'uploads',
  false,
  52428800,
  array[
    'image/png',
    'image/jpeg',
    'application/pdf',
    'text/plain',
    'text/markdown'
  ]
)
on conflict (id) do nothing;

create policy "uploads_read_own" on storage.objects
for select
using (bucket_id = 'uploads' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "uploads_insert_own" on storage.objects
for insert
with check (bucket_id = 'uploads' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "uploads_update_own" on storage.objects
for update
using (bucket_id = 'uploads' and auth.uid()::text = (storage.foldername(name))[1])
with check (bucket_id = 'uploads' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "uploads_delete_own" on storage.objects
for delete
using (bucket_id = 'uploads' and auth.uid()::text = (storage.foldername(name))[1]);
