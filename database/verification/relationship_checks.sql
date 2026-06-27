-- Relationship and constraint verification queries for PrepOS schema.

-- 1) Verify tables exist
select tablename
from pg_tables
where schemaname = 'public'
  and tablename in (
    'profiles', 'daily_tasks', 'study_sessions', 'progress', 'knowledge_notes',
    'flashcards', 'error_logs', 'mock_tests', 'mock_sections', 'attachments',
    'notifications', 'roadmap', 'settings', 'achievements', 'activity_logs'
  )
order by tablename;

-- 2) Verify foreign keys and cascade rules
select
  conrelid::regclass as table_name,
  conname as constraint_name,
  confrelid::regclass as referenced_table,
  pg_get_constraintdef(oid) as definition
from pg_constraint
where contype = 'f'
  and connamespace = 'public'::regnamespace
order by conrelid::regclass::text, conname;

-- 3) Verify RLS is enabled on all user-owned tables
select
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as force_rls
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in (
    'profiles', 'daily_tasks', 'study_sessions', 'progress', 'knowledge_notes',
    'flashcards', 'error_logs', 'mock_tests', 'mock_sections', 'attachments',
    'notifications', 'roadmap', 'settings', 'achievements', 'activity_logs'
  )
order by c.relname;

-- 4) Verify indexes required by docs
select schemaname, tablename, indexname
from pg_indexes
where schemaname = 'public'
  and indexname like 'idx_%'
order by tablename, indexname;

-- 5) Verify storage bucket
select id, name, public, file_size_limit
from storage.buckets
where id = 'uploads';

-- 6) Verify storage policies
select policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
order by policyname;
