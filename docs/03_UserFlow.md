# UserFlow
# PrepOS - User Flow

Version: 1.0

Status: Draft

---

# Purpose

This document defines how users navigate through PrepOS.

It describes every major screen, user journey, and interaction.

The objective is to ensure a simple, predictable, and consistent user experience across desktop, tablet, and mobile devices.

---

# User Journey Overview

```text
Landing Page
      │
      ▼
Authentication
      │
      ▼
Onboarding
      │
      ▼
Dashboard
      │
 ┌────┼──────────────────────────────────────────────────────────┐
 ▼    ▼           ▼          ▼         ▼        ▼        ▼
Planner Progress Knowledge Error Log Mock Analytics Settings
                Base
```

---

# 1. Landing Page

Purpose:

Introduce PrepOS.

Actions:

* View Features
* View Screenshots
* View Roadmap
* Login
* Create Account

If user is already authenticated:

Automatically redirect to Dashboard.

---

# 2. Authentication Flow

## Login

User enters:

* Email
* Password

OR

* Google Login
* GitHub Login

Successful login:

→ Dashboard

Failure:

Display validation message.

---

## Signup

Collect:

* Name
* Email
* Password

After account creation:

Redirect to Onboarding.

---

## Forgot Password

User enters email.

Reset link is sent.

---

# 3. Onboarding

Displayed only once.

Collect:

Exam

Target Score

Exam Date

College Timing

Gym Timing

Preferred Study Hours

Preferred Theme

Notification Permission

Timezone

After completion:

Generate first roadmap.

Redirect:

Dashboard.

---

# 4. Dashboard

Dashboard is the application's home.

Display:

* Welcome message
* CAT Countdown
* Today's Tasks
* Progress Cards
* Study Hours
* Current Streak
* Subject Progress
* Weak Topics
* Upcoming Mock
* Recent Notes
* Notifications
* Heatmap
* Quick Actions

Quick Actions:

Create Task

Create Note

Upload Formula

Start Study Session

Add Mock

---

# Dashboard Navigation

Sidebar contains:

Dashboard

Planner

Calendar

Progress

Knowledge Base

Error Log

Mocks

Analytics

Notifications

Settings

Profile

---

# 5. Planner Flow

Planner

↓

Daily View

↓

Weekly View

↓

Monthly View

↓

Task Details

Actions:

Create Task

Edit Task

Delete Task

Duplicate Task

Complete Task

Reschedule Task

Start Study Session

Every completed task immediately updates:

Progress

Analytics

Study Hours

Dashboard

---

# 6. Calendar Flow

Calendar

↓

Select Date

↓

View Tasks

↓

Open Task

↓

Complete Task

↓

Progress Updated

Missed tasks:

Automatically moved to future schedule.

---

# 7. Subject Flow

Subjects

↓

Quant

↓

Topic

↓

Subtopic

↓

Questions Solved

↓

Revision

↓

Mastery

Same structure applies for:

LRDI

VARC

---

# 8. Knowledge Base Flow

Knowledge Base

↓

Folder

↓

Subject

↓

Topic

↓

Notes

User may:

Create Note

Edit Note

Delete Note

Bookmark Note

Convert to Flashcard

Attach Image

Attach PDF

Search

Tag

Archive

---

# 9. Flashcard Flow

Knowledge Base

↓

Flashcards

↓

Review Queue

↓

Easy

Medium

Hard

↓

Schedule Next Review

Statistics updated automatically.

---

# 10. Error Log Flow

User solves question.

↓

Question is incorrect.

↓

Open Error Log.

↓

Create Error Entry.

↓

Upload Screenshot.

↓

Select Subject.

↓

Select Topic.

↓

Select Mistake Type.

↓

Write Correct Method.

↓

Save.

System schedules revision automatically.

---

# 11. Mock Flow

Dashboard

↓

Mocks

↓

Add Mock

↓

Enter Score

↓

Section Scores

↓

Time

↓

Accuracy

↓

Save

↓

Analytics Updated

↓

Recommendations Generated

---

# 12. Analytics Flow

Analytics

↓

Weekly

↓

Monthly

↓

Subject

↓

Mock Trend

↓

Heatmap

↓

Export Report

---

# 13. Notification Flow

System generates notifications for:

Study Reminder

Revision Reminder

Mock Reminder

Missed Tasks

Streak Warning

Daily Goal

User clicks notification.

↓

Opens related screen.

---

# 14. Search Flow

Global Search

Supports:

Tasks

Notes

Formula

Flashcards

Errors

Mocks

Topics

Subjects

Attachments

Results grouped by category.

---

# 15. Profile Flow

Profile

↓

Achievements

↓

Statistics

↓

Study History

↓

Goals

↓

Settings

---

# 16. Settings Flow

Settings

↓

General

↓

Appearance

↓

Notifications

↓

Study Preferences

↓

Account

↓

Export

↓

Import

---

# 17. Roadmap Flow

Onboarding

↓

Roadmap Engine

↓

Daily Plan

↓

Task Generation

↓

Progress

↓

Recalculate

↓

Next Day

Roadmap is dynamic.

It never becomes static.

---

# 18. Study Session Flow

Dashboard

↓

Start Study Session

↓

Select Subject

↓

Select Topic

↓

Timer Starts

↓

Finish Session

↓

Hours Saved

↓

Progress Updated

↓

Analytics Updated

---

# 19. Screenshot Flow

Take Screenshot

↓

Upload

↓

Knowledge Base OR Error Log

↓

Store in Cloud

↓

Attach Metadata

↓

Searchable

Future:

OCR extracts text automatically.

---

# 20. Mobile Flow

Open PrepOS

↓

Dashboard

↓

Today's Tasks

↓

Complete Task

↓

Receive Reminder

↓

Review Flashcards

↓

Sync Automatically

---

# 21. Offline Flow

Open App

↓

Offline

↓

View Cached Notes

↓

Complete Tasks

↓

Store Changes Locally

↓

Reconnect

↓

Sync Automatically

---

# 22. AI Flow (Future)

Dashboard

↓

Ask AI

↓

Select Context

Planner

Notes

Mock

Errors

↓

AI Responds

↓

Recommendations

↓

User Accepts

↓

Roadmap Updated

---

# Navigation Rules

1. Dashboard is always the default page after login.
2. Sidebar is persistent on desktop.
3. Bottom navigation may be used on mobile.
4. Every page must provide breadcrumb navigation where appropriate.
5. Search must be globally accessible.
6. Quick actions should never be more than one click away.
7. No critical workflow should require more than three navigation steps.

---

# User Experience Principles

* Minimize clicks.
* Keep navigation consistent.
* Preserve user context when navigating.
* Autosave where possible.
* Provide immediate feedback after actions.
* Use smooth transitions without slowing the interface.
* Make the app equally usable on desktop and mobile.

---

# Success Criteria

A user should be able to:

* Sign up and complete onboarding in under 5 minutes.
* Find any feature within 3 clicks.
* Create and complete a study task in under 30 seconds.
* Log a mistake in under 1 minute.
* Review flashcards quickly during short breaks.
* Understand their preparation status immediately from the dashboard.

The overall experience should feel fast, organized, and focused on helping the student study—not on managing the app itself.
