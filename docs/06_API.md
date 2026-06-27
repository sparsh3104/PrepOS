# API
# PrepOS - API & Service Layer Specification

Version: 1.0

Status: Draft

---

# Purpose

This document defines how the frontend communicates with backend services.

PrepOS follows a Service Layer architecture.

Components never communicate directly with the database.

Instead they use service functions.

Flow:

UI

↓

Service

↓

Supabase

↓

Database

↓

Service

↓

UI

---

# Architecture

```text
Component

↓

Custom Hook (optional)

↓

Service

↓

Supabase

↓

Database
```

---

# Folder Structure

services/

auth.service.ts

planner.service.ts

progress.service.ts

knowledge.service.ts

flashcard.service.ts

errorLog.service.ts

mock.service.ts

analytics.service.ts

notification.service.ts

roadmap.service.ts

storage.service.ts

profile.service.ts

---

# Authentication Service

Purpose

Handle authentication.

Functions

signUp()

signIn()

signOut()

resetPassword()

updatePassword()

getCurrentUser()

refreshSession()

---

# Planner Service

Purpose

Manage planner.

Functions

getDailyTasks(date)

getWeeklyTasks()

getMonthlyTasks()

createTask()

updateTask()

deleteTask()

completeTask()

moveTask()

duplicateTask()

startStudySession()

finishStudySession()

generateDailyPlan()

---

# Progress Service

Purpose

Track progress.

Functions

getOverallProgress()

getSubjectProgress()

getTopicProgress()

updateProgress()

recalculateProgress()

getWeakTopics()

getStrongTopics()

---

# Knowledge Service

Purpose

Manage notes.

Functions

getNotes()

createNote()

updateNote()

deleteNote()

archiveNote()

bookmarkNote()

searchNotes()

filterNotes()

uploadAttachment()

downloadAttachment()

---

# Flashcard Service

Purpose

Manage flashcards.

Functions

getFlashcards()

createFlashcard()

updateFlashcard()

deleteFlashcard()

reviewFlashcard()

scheduleNextReview()

getRevisionQueue()

---

# Error Log Service

Purpose

Track mistakes.

Functions

getErrors()

createError()

updateError()

deleteError()

reviewError()

uploadScreenshot()

filterErrors()

searchErrors()

---

# Mock Service

Purpose

Manage mock tests.

Functions

getMocks()

createMock()

updateMock()

deleteMock()

getMockAnalysis()

calculateAccuracy()

calculateSectionScore()

getWeakAreas()

---

# Analytics Service

Purpose

Generate statistics.

Functions

getStudyHours()

getWeeklyStats()

getMonthlyStats()

getHeatmap()

getMockTrend()

getProgressTrend()

getStudyStreak()

---

# Notification Service

Purpose

Manage reminders.

Functions

scheduleNotification()

cancelNotification()

markRead()

getNotifications()

sendPush()

generateDailyReminder()

generateRevisionReminder()

---

# Roadmap Service

Purpose

Generate study roadmap.

Functions

generateRoadmap()

updateRoadmap()

regenerateRoadmap()

rescheduleMissedTasks()

calculateDailyWorkload()

calculateCompletion()

---

# Storage Service

Purpose

Manage uploads.

Functions

uploadImage()

uploadPDF()

uploadScreenshot()

deleteFile()

getSignedUrl()

listFiles()

---

# Profile Service

Purpose

Manage user profile.

Functions

getProfile()

updateProfile()

updateStudyHours()

updateExamDate()

updatePreferences()

---

# Server Routes

Only create API routes when necessary.

Examples:

/api/ai/chat

/api/ocr

/api/notifications/send

/api/export

/api/import

/api/webhooks

Everything else should use Supabase directly through services.

---

# Service Rules

Every service must:

Validate input

Handle errors

Return typed responses

Never return raw database errors

Never expose Supabase implementation to components

---

# Response Format

Every service returns:

success

data

error

message

Example

{
success: true,
data: {},
error: null,
message: "Task created successfully."
}

---

# Error Handling

Use custom error messages.

Do not expose SQL errors.

Every error should be mapped to user-friendly text.

---

# Validation

Validate:

Before database write

Before upload

Before delete

Before update

Use Zod.

---

# Pagination

Large datasets must support:

page

limit

search

sort

filters

Infinite scrolling may be used for notes and flashcards.

---

# Search

Search supports:

Tasks

Notes

Flashcards

Errors

Mocks

Attachments

Topics

Search should be debounced.

---

# File Upload Flow

User

↓

Select File

↓

Validate

↓

Upload to Storage

↓

Create Attachment Record

↓

Link Attachment

↓

Return URL

---

# Planner Flow

Create Task

↓

Validate

↓

Insert Task

↓

Update Progress

↓

Refresh Dashboard

↓

Schedule Reminder

---

# Mock Flow

Create Mock

↓

Store Summary

↓

Store Sections

↓

Calculate Accuracy

↓

Update Analytics

↓

Recommend Weak Areas

---

# Flashcard Flow

Create Flashcard

↓

Calculate Initial Review Date

↓

Store

↓

Add to Revision Queue

---

# Error Log Flow

Create Error

↓

Upload Screenshot

↓

Store Error

↓

Schedule Review Reminder

---

# Roadmap Flow

Input

↓

Exam Date

↓

Study Hours

↓

Existing Progress

↓

Generate Plan

↓

Store Roadmap

↓

Generate Daily Tasks

---

# AI Endpoints (Future)

/api/ai/chat

/api/ai/planner

/api/ai/ocr

/api/ai/recommendations

/api/ai/mock-analysis

---

# API Design Principles

1. Components never call Supabase directly.
2. All database access goes through services.
3. Keep services small and focused.
4. Return typed responses.
5. Handle all errors gracefully.
6. Prefer reusable service functions.
7. Minimize duplicate logic.
8. Keep business rules inside services, never inside UI components.
