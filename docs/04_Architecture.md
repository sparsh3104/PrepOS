# Architecture
# PrepOS - Software Architecture

Version: 1.0

Status: Draft

---

# Purpose

This document defines the software architecture of PrepOS.

Its goals are:

* Maintainable code
* Modular development
* Scalability
* High performance
* Production readiness
* Easy onboarding for contributors

PrepOS follows a **Feature-First Modular Architecture** with clear separation between presentation, business logic, data access, and infrastructure.

---

# High-Level Architecture

```text
                        USER

                          │

                    Next.js Frontend

                          │

        ┌─────────────────────────────────┐
        │                                 │
        ▼                                 ▼

     Zustand Store                 React Query

        │                                 │

        └──────────────┬──────────────────┘
                       │

                 Service Layer

                       │

                Supabase Client

         ┌─────────────┴─────────────┐

         ▼                           ▼

   PostgreSQL Database        Supabase Storage

         │                           │

         └─────────────┬─────────────┘

                       ▼

              Browser / PWA Client
```

---

# Technology Stack

## Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Framer Motion
* Recharts

---

## Backend

* Supabase

---

## Database

* PostgreSQL

---

## Authentication

* Supabase Auth

---

## Storage

* Supabase Storage

---

## State

* Zustand

---

## Data Fetching

* TanStack Query

---

## Forms

* React Hook Form

* Zod Validation

---

## Deployment

* Vercel

---

## PWA

* next-pwa

---

# Project Structure

```text
app/
components/
features/
services/
store/
lib/
hooks/
providers/
contexts/
config/
types/
utils/
database/
data/
public/
docs/
```

---

# Layer Responsibilities

## Presentation Layer

Contains:

* Pages
* Components
* Layouts
* Modals
* Cards

Rules:

* No business logic.
* No database queries.
* UI only.

---

## Business Layer

Located inside:

services/

Responsible for:

* Validation
* Scheduling
* Planner logic
* Progress calculations
* Mock analysis
* Notifications

Rules:

* No UI code.

---

## State Layer

Located inside:

store/

Responsible for:

* Authentication state
* Planner state
* Progress state
* Theme state
* Settings state

Use Zustand.

---

## Data Layer

Located inside:

lib/

Responsible for:

* Supabase client
* Queries
* Upload helpers
* Storage
* Authentication

---

# Feature Modules

Every feature is independent.

Modules:

* Authentication
* Dashboard
* Planner
* Calendar
* Progress
* Subject Tracker
* Knowledge Base
* Flashcards
* Error Log
* Mock Analysis
* Analytics
* Notifications
* Settings
* Profile
* AI (Future)

Each module owns its UI, services, state, and types where appropriate.

---

# Data Flow

User Action

↓

Component

↓

Service

↓

Supabase

↓

Database

↓

Response

↓

State Update

↓

UI Re-render

Business logic must always execute before database writes.

---

# Authentication Flow

User

↓

Supabase Auth

↓

JWT Session

↓

Protected Routes

↓

Dashboard

Unauthenticated users are redirected to Login.

---

# Routing

Public Routes

* /
* /login
* /signup
* /forgot-password

Protected Routes

* /dashboard
* /planner
* /calendar
* /progress
* /knowledge-base
* /error-log
* /flashcards
* /mocks
* /analytics
* /settings
* /profile

---

# State Management

Global state should only include:

* User
* Theme
* Planner
* Progress
* Notifications
* Settings

Avoid storing server data permanently in Zustand.

Use React Query for cached server state.

---

# Database Access

All database interactions must go through service functions.

Components must never directly call Supabase.

Example flow:

Component → Service → Supabase → Database

---

# Error Handling

Every asynchronous operation must:

* Handle loading state
* Catch errors
* Display user-friendly messages
* Log unexpected failures

No silent failures.

---

# File Upload Architecture

Supported uploads:

* Images
* PDFs
* Screenshots

Flow:

User

↓

Upload Component

↓

Supabase Storage

↓

Metadata stored in PostgreSQL

↓

Linked to Note / Error / Flashcard

---

# Notification Architecture

Notifications are generated from:

* Planner
* Mock schedule
* Revision queue
* Daily goals
* Streak tracking

Browser Push Notifications are delivered through the PWA.

---

# Roadmap Engine

The Roadmap Engine is the central planning service.

Inputs:

* Exam date
* Available study hours
* College schedule
* Gym schedule
* Subject priorities
* Mock schedule

Outputs:

* Daily plan
* Weekly plan
* Monthly plan
* Catch-up schedule

The roadmap updates dynamically whenever tasks are completed or missed.

---

# Offline Strategy

Offline support includes:

* Cached UI
* Cached notes
* Cached tasks
* Cached flashcards

Offline changes are queued locally and synchronized when connectivity returns.

---

# Security

Use:

* Row Level Security (RLS)
* Protected API access
* Secure file uploads
* JWT authentication
* Environment variables for secrets
* Server-side validation where applicable

Never expose sensitive keys in the client.

---

# Performance

Requirements:

* Lazy load heavy pages
* Code splitting
* Dynamic imports
* Image optimization
* Pagination for large datasets
* React memoization where beneficial
* Efficient caching with React Query

Target first meaningful paint: under 2 seconds on a typical broadband connection.

---

# Logging

Log important events:

* Login
* Logout
* Task completion
* Mock creation
* Note creation
* File upload
* Planner generation

This supports future analytics and debugging.

---

# Coding Standards

* TypeScript strict mode.
* No use of `any`.
* Reusable components.
* Consistent naming.
* Descriptive commit messages.
* Keep functions focused and testable.
* Prefer composition over duplication.

---

# Scalability

The architecture should support adding new exams by introducing syllabus data and configuration rather than changing core logic.

Examples:

* CAT
* GATE
* UPSC
* JEE
* NEET
* GRE

The Roadmap Engine should remain generic so it can schedule preparation for any supported exam.

---

# Future Architecture

Planned additions:

* AI Recommendation Service
* OCR Service
* Voice Notes
* Mobile wrappers
* Team collaboration
* Mentor dashboard
* Public template marketplace

These features should integrate without requiring major architectural changes.

---

# Architecture Principles

1. Build modules, not pages.
2. Keep business logic out of UI.
3. Prefer reusable services.
4. Design for long-term maintainability.
5. Optimize for clarity before cleverness.
6. Keep the user experience fast and responsive.
7. Every architectural decision should support scalability and reliability.
