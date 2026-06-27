# Database
# PrepOS - Database Design

Version: 1.0

Status: Draft

Database: PostgreSQL (Supabase)

---

# Purpose

This document defines the complete database architecture for PrepOS.

Principles:

* UUID primary keys
* Row Level Security (RLS)
* Normalized design
* Soft deletes where useful
* Timestamps on every table
* Optimized for scalability
* User-specific data isolation

The CAT syllabus (subjects, topics, subtopics) is stored in JSON files under `/data` and is **not duplicated** in the database.

---

# Common Fields

Unless specified otherwise, every table includes:

* id (UUID, Primary Key)
* user_id (UUID, Foreign Key to auth.users)
* created_at
* updated_at

---

# 1. profiles

Purpose:

Store user profile information.

Fields:

* id
* user_id
* full_name
* avatar_url
* target_exam
* target_score
* exam_date
* timezone
* daily_study_goal_hours
* college_schedule (JSON)
* gym_schedule (JSON)
* onboarding_completed

Relationship:

One profile belongs to one authenticated user.

---

# 2. daily_tasks

Purpose:

Store all planner tasks.

Fields:

* id
* user_id
* title
* description
* subject
* topic
* subtopic
* priority
* estimated_minutes
* actual_minutes
* due_date
* reminder_time
* status
* recurrence_rule
* notes
* attachment_count

Status Values:

* pending
* in_progress
* completed
* skipped

---

# 3. study_sessions

Purpose:

Track actual study sessions.

Fields:

* id
* user_id
* task_id
* subject
* topic
* started_at
* ended_at
* duration_minutes
* notes

One task can have multiple study sessions.

---

# 4. progress

Purpose:

Track progress by subject/topic/subtopic.

Fields:

* id
* user_id
* subject
* topic
* subtopic
* completion_percentage
* mastery_percentage
* questions_solved
* correct_answers
* incorrect_answers
* revision_count
* last_revision_at

This table stores progress only.

The syllabus comes from JSON.

---

# 5. knowledge_notes

Purpose:

Store notes and formulas.

Fields:

* id
* user_id
* title
* content
* subject
* topic
* subtopic
* tags (TEXT[])
* is_formula
* is_bookmarked
* is_archived

Supports:

Markdown

Rich Text

Images

PDFs

---

# 6. flashcards

Purpose:

Revision system.

Fields:

* id
* user_id
* note_id
* front
* back
* difficulty
* next_review
* review_interval
* repetitions
* ease_factor
* last_review

Implements spaced repetition.

---

# 7. error_logs

Purpose:

Track mistakes.

Fields:

* id
* user_id
* subject
* topic
* subtopic
* question_title
* mistake_type
* difficulty
* explanation
* correct_solution
* screenshot_attachment_id
* review_date
* revision_count
* status

Mistake Types:

* concept
* calculation
* silly
* time_management

---

# 8. mock_tests

Purpose:

Store mock summaries.

Fields:

* id
* user_id
* mock_name
* provider
* test_date
* total_score
* percentile
* duration_minutes
* overall_accuracy
* notes

---

# 9. mock_sections

Purpose:

Store section-wise results.

Fields:

* id
* mock_test_id
* section_name
* attempts
* correct
* incorrect
* skipped
* score
* accuracy
* time_spent_minutes

Relationship:

One mock has many sections.

---

# 10. attachments

Purpose:

Store uploaded files.

Fields:

* id
* user_id
* file_name
* storage_path
* mime_type
* size
* linked_table
* linked_record_id

Supported Files:

* PNG
* JPG
* JPEG
* PDF

Future:

* Video
* Audio

---

# 11. notifications

Purpose:

Store notification history.

Fields:

* id
* user_id
* title
* message
* type
* is_read
* scheduled_for
* delivered_at

Types:

* planner
* reminder
* mock
* streak
* revision
* system

---

# 12. roadmap

Purpose:

Store generated study roadmap.

Fields:

* id
* user_id
* roadmap_version
* start_date
* end_date
* roadmap_json
* generated_at

The generated roadmap is stored as JSON for flexibility.

---

# 13. settings

Purpose:

Store user preferences.

Fields:

* id
* user_id
* theme
* accent_color
* notifications_enabled
* push_enabled
* language
* first_day_of_week

---

# 14. achievements

Purpose:

Gamification.

Fields:

* id
* user_id
* achievement_name
* achievement_key
* unlocked_at

Examples:

* 7 Day Streak
* 100 Study Hours
* 50 Flashcards Reviewed

---

# 15. activity_logs

Purpose:

Audit important actions.

Fields:

* id
* user_id
* action
* entity_type
* entity_id
* metadata (JSON)
* created_at

Examples:

* Task Completed
* Mock Added
* Flashcard Reviewed

---

# Relationships

profiles

↓

daily_tasks

↓

study_sessions

↓

progress

knowledge_notes

↓

flashcards

error_logs

↓

attachments

mock_tests

↓

mock_sections

notifications

roadmap

settings

achievements

activity_logs

All major entities belong to one user.

---

# Storage Structure

Supabase Storage Buckets

uploads/

├── avatars/

├── notes/

├── formulas/

├── screenshots/

├── mocks/

└── documents/

---

# Indexes

Create indexes for:

* user_id
* due_date
* subject
* topic
* status
* next_review
* review_date
* test_date

These support planner, revision, and analytics queries.

---

# Row Level Security

Enable RLS on all user-owned tables.

Policy:

A user may only:

* Read their own data
* Insert their own data
* Update their own data
* Delete their own data

No user should access another user's records.

---

# Backup Strategy

* PostgreSQL managed by Supabase
* Storage managed by Supabase Storage
* User exports available in future versions

---

# Database Design Principles

1. Store user-generated data in the database.
2. Store static syllabus data in JSON files.
3. Avoid duplication.
4. Keep relationships simple.
5. Design for future expansion beyond CAT.
6. Use JSON only where flexibility is beneficial (roadmap, schedules, metadata).
