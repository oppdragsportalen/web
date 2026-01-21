# Oppdragsportalen

A assignment management platform built with Next.js and Supabase. Create assignments with public or restricted visibility.

## Features

### Authentication & User Management

- Secure signup/login with Supabase Auth
- User profiles with display names
- SSR-aware authentication
- Profile editing in settings

### Assignment Management

- **Create Assignments**: Title, description, and deadline
- **Visibility Control**:
  - Public assignments (visible to all)
  - Restricted assignments (specific users only)
- **Allowed Users**: Add specific users to restricted assignments

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Database**: Supabase (PostgreSQL + Auth)
- **UI**: Radix Themes/Icons, Tailwind v4, next-themes
- **Authentication**: Supabase SSR (@supabase/ssr)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Set Up Database

1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql` in the Supabase SQL Editor
3. Enable email/password authentication in Supabase Dashboard

### 4. Run Development Server

```bash
npm run dev
```

## Database Schema

### Tables

- **profiles**: User profiles with display names
- **assignments**: Assignment data with visibility settings
- **assignment_allowed_users**: Access control for restricted assignments
- **assignment_claims**: User responses (accept/decline) to assignments

### Security

- Row Level Security (RLS) policies on all tables
- Users can only see/edit their own data and accessible assignments
- Assignment creators have full control over their assignments
- Public assignments are visible to all authenticated users
- Restricted assignments require explicit user allowlist

---

> AI-generated with Claude Sonnet 4.5 on 2026-01-21.
