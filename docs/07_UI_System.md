# UI_System
# PrepOS - UI / UX Design System

Version: 1.0

Status: Draft

---

# Purpose

This document defines the visual language and design system of PrepOS.

Every screen, component, and interaction must follow these guidelines.

The design should feel modern, minimal, fast, and professional.

---

# Design Inspiration

PrepOS combines ideas from:

* Linear
* Notion
* GitHub
* Apple
* Vercel Dashboard
* Raycast
* Arc Browser

Avoid Material Design aesthetics.

The interface should look premium and productivity-focused.

---

# Design Principles

1. Simplicity
2. Consistency
3. Readability
4. Accessibility
5. Performance
6. Mobile First
7. Minimal Clicks

---

# Theme

Dark Mode First

Light mode is supported.

Dark mode should feel premium rather than pure black.

Recommended colors:

Background

#0F1117

Surface

#171923

Card

#1E2230

Border

#2A3142

Primary

#4F8CFF

Success

#22C55E

Warning

#F59E0B

Danger

#EF4444

Text Primary

#FFFFFF

Text Secondary

#A5ADBA

---

# Typography

Font Family

Geist

Fallback

Inter

Weights

400

500

600

700

Sizes

12

14

16

18

20

24

30

36

48

Never use inconsistent font sizes.

---

# Border Radius

Small

8px

Medium

12px

Large

16px

Extra Large

24px

Cards should feel soft.

---

# Shadows

Use soft shadows only.

Avoid heavy elevation.

Cards should appear floating but subtle.

---

# Layout

Desktop

Sidebar

Topbar

Content Area

Right Panel (optional)

Mobile

Topbar

Bottom Navigation

Scrollable Content

Tablet

Collapsible Sidebar

---

# Grid System

Use CSS Grid.

Gap

16px

24px

32px

Responsive breakpoints:

Mobile

Tablet

Desktop

Wide

---

# Sidebar

Contains

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

Collapsed mode supported.

---

# Topbar

Contains

Search

Notifications

Theme Toggle

Profile

Breadcrumb

---

# Dashboard Layout

Top Section

Welcome

Countdown

Study Hours

Middle Section

Today's Tasks

Progress

Bottom Section

Analytics

Heatmap

Weak Topics

Recent Notes

---

# Cards

Cards are the primary UI element.

Every card includes:

Title

Optional Description

Action Button

Content

Hover State

Loading State

Empty State

---

# Buttons

Types

Primary

Secondary

Ghost

Outline

Danger

Icon

Loading

Disabled

---

# Inputs

Text

Password

Email

Textarea

Search

Select

Date Picker

Time Picker

File Upload

Switch

Checkbox

Radio

Slider

---

# Tables

Used for

Mocks

Tasks

Errors

Notifications

Features

Sorting

Filtering

Pagination

Responsive

---

# Modals

Support

Create

Edit

Delete

Confirmation

Preview

Upload

---

# Forms

Use:

React Hook Form

Zod

Inline validation

Required field indicators

Loading state

Success state

Error state

---

# Charts

Use Recharts.

Charts:

Line

Area

Bar

Pie

Heatmap

Progress Ring

Circular Progress

---

# Animations

Use Framer Motion.

Animations should be:

Fast

Subtle

Smooth

Avoid excessive movement.

---

# Icons

Lucide React only.

Use consistent icon sizes.

---

# Empty States

Every page must have an empty state.

Example:

"No tasks scheduled for today."

Provide a clear action button.

---

# Loading States

Use skeleton loaders.

Avoid blank pages.

---

# Notifications

Toast notifications.

Top-right on desktop.

Bottom on mobile.

---

# Search

Global search.

Always accessible.

Keyboard Shortcut:

Ctrl + K

---

# Mobile Design

Minimum touch target

44px

Bottom navigation

Large buttons

Responsive cards

---

# Accessibility

Keyboard navigation

Focus states

ARIA labels

High contrast

Screen reader friendly

---

# Performance

Lazy load charts

Lazy load heavy pages

Optimize images

Dynamic imports

---

# UI Components

Use reusable components only.

Never duplicate UI.

If two pages share the same design, extract a reusable component.

---

# Design Philosophy

PrepOS should feel like a premium productivity application.

The interface should disappear into the background, allowing users to focus on studying.

Every design decision should answer one question:

"Does this help the user study faster or more effectively?"
