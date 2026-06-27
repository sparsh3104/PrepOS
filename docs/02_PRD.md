# PRD
# PrepOS - Product Requirements Document (PRD)

Version: 1.0

Status: Draft

---

# 1. Product Overview

PrepOS is an AI-powered Study Operating System designed to centralize every aspect of exam preparation.

Instead of using multiple applications for planning, notes, flashcards, reminders, analytics, and mock analysis, students use one integrated platform.

The system is designed to be modular, scalable, and exam-independent.

Initial release focuses on CAT preparation while supporting future expansion to GATE, UPSC, JEE, NEET, GRE, GMAT, placements, and university exams.

---

# 2. Product Objectives

The application must:

* Organize preparation automatically.
* Reduce planning effort.
* Improve consistency.
* Track measurable progress.
* Provide actionable insights.
* Adapt schedules dynamically.
* Support long-term revision.

---

# 3. User Roles

## Student

Primary user.

Can:

* Manage study plans
* Track progress
* Create notes
* Create flashcards
* Upload screenshots
* Analyze mocks
* Receive reminders
* View analytics

---

## Admin (Future)

Can:

* Manage syllabus
* Publish templates
* View analytics
* Manage users

---

# 4. Dashboard Module

Purpose:

Provide a complete overview immediately after login.

Components:

* Welcome Card
* Today's Tasks
* CAT Countdown
* Study Hours
* Current Streak
* Subject Progress
* Weak Topics
* Recent Notes
* Upcoming Mock
* Heatmap
* Quick Actions
* Notifications

Requirements:

* Responsive
* Real-time updates
* Dark mode
* Mobile friendly

---

# 5. Planner Module

Purpose:

Central planning system.

Views:

* Daily
* Weekly
* Monthly
* Timeline

Features:

* Add Task
* Edit Task
* Delete Task
* Complete Task
* Drag and Drop
* Priorities
* Categories
* Deadlines
* Estimated Duration
* Study Sessions
* Calendar Integration
* Auto Reschedule

Each task supports:

* Subject
* Topic
* Subtopic
* Notes
* Attachments
* Reminder
* Completion Status

---

# 6. Roadmap Engine

Purpose:

Automatically generate preparation plans.

Inputs:

* Exam Date
* Available Study Hours
* College Timetable
* Gym Schedule
* Holidays
* Mock Schedule
* Subject Priorities

Outputs:

* Daily Tasks
* Weekly Plan
* Monthly Plan
* Catch-up Plans

Behavior:

If a task is missed:

* Move task forward
* Recalculate remaining workload
* Preserve priorities

---

# 7. Subject Tracker

Subjects:

* Quant
* LRDI
* VARC

Each subject contains:

Topics

↓

Subtopics

↓

Question Practice

↓

Revision

↓

Mastery

Metrics:

* Completion %
* Questions Solved
* Accuracy
* Time Spent
* Last Revision
* Weakness Score

---

# 8. Knowledge Base

Purpose:

Central repository for learning materials.

Supports:

* Formula Notes
* Rich Text Notes
* Markdown
* Images
* PDFs
* Screenshots
* OCR (Future)
* Code Blocks
* Tables

Organization:

Folders

↓

Subjects

↓

Topics

↓

Tags

↓

Bookmarks

Search:

Global Search

Filters

Tags

Subject

Date

---

# 9. Flashcards

Purpose:

Long-term memory retention.

Features:

* Front
* Back
* Images
* Markdown
* Difficulty
* Tags
* Folder
* Subject
* Topic

Supports:

Spaced Repetition

Easy

Medium

Hard

Revision Queue

Statistics

---

# 10. Error Log

Purpose:

Track every mistake.

Each record stores:

Question

Screenshot

Subject

Topic

Subtopic

Difficulty

Mistake Type

Correct Solution

Personal Notes

Revision Date

Review Count

Status

Mistake Types:

* Concept
* Calculation
* Silly Mistake
* Time Management

---

# 11. Mock Analysis

Purpose:

Measure performance.

Store:

Mock Number

Date

Overall Score

Section Scores

Attempts

Correct

Incorrect

Accuracy

Time Taken

Percentile

Weak Topics

Recommendations

Visualizations:

Trend

Accuracy

Time

Subject Comparison

---

# 12. Analytics

Display:

Study Hours

Weekly Study

Monthly Study

Heatmap

Completion %

Mock Trend

Accuracy

Subject Progress

Revision Frequency

Task Completion

Current Streak

Longest Streak

---

# 13. Notifications

Support:

Daily Reminder

Revision Reminder

Task Reminder

Mock Reminder

Deadline Reminder

Achievement Notification

Push Notifications

Browser Notifications

Notification History

---

# 14. Attachments

Supported:

PNG

JPG

JPEG

PDF

Markdown

TXT

Future:

Video

Voice Notes

OCR

---

# 15. Search

Global Search should search:

Tasks

Notes

Flashcards

Formula

Errors

Mocks

Topics

Subjects

Attachments

---

# 16. Settings

Support:

Theme

Accent Color

Notifications

Study Hours

Exam Date

College Timetable

Gym Schedule

Language

Profile

Export Data

Import Data

---

# 17. Profile

Display:

Avatar

Name

Exam

Target Score

Study Hours

Current Streak

Achievements

Statistics

---

# 18. Gamification

Support:

XP

Levels

Achievements

Badges

Streak

Milestones

Leaderboards (Future)

---

# 19. Offline Mode

Requirements:

View notes offline

Create tasks offline

Create flashcards offline

Queue changes

Sync automatically when online

---

# 20. PWA Requirements

Installable

Responsive

Offline Support

Push Notifications

Background Sync

Mobile Friendly

Desktop Friendly

Tablet Friendly

---

# 21. Security

Authentication:

Supabase Auth

Email

Google

GitHub

Security Requirements:

JWT

Row Level Security

Encrypted Storage

Secure Uploads

Protected Routes

Input Validation

Rate Limiting (Future)

---

# 22. Performance Requirements

First Load < 2 seconds

Lazy Loading

Code Splitting

Image Optimization

Caching

Pagination

Realtime Updates

---

# 23. Future AI Features

AI Planner

AI Coach

OCR

Formula Extraction

Weak Topic Detection

Revision Suggestions

Mock Analysis

AI Chat Assistant

Voice Assistant

---

# 24. MVP Scope

The first production release must include:

* Authentication
* Dashboard
* Planner
* Calendar
* Subject Tracker
* Knowledge Base
* Flashcards
* Error Log
* Mock Analysis
* Analytics
* Notifications
* Roadmap Engine
* PWA Support

AI features are excluded from MVP and will be added in later releases.

---

# 25. Definition of Done

A feature is considered complete only when:

* UI is responsive.
* Backend integration is complete.
* Validation is implemented.
* Error handling exists.
* Loading states exist.
* Empty states exist.
* Mobile experience is tested.
* Dark mode is supported.
* Types are fully defined.
* Documentation is updated.

No feature should be marked complete without satisfying all of the above requirements.
