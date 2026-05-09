# Oppdragsportalen

Assignment management platform built with Next.js and Supabase. Users can create assignments with public or restricted visibility and manage who has access.

## Tech Stack

- **Framework**: Next.js 16, React 19, TypeScript
- **Backend / DB**: Supabase (PostgreSQL, Auth, RLS)
- **UI**: Radix Themes/Icons, Tailwind CSS v4

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> The service role key is only used in server-side code (e.g. admin Supabase client, server actions) and is never exposed to the browser.

### 3. Set Up Database

1. Create a Supabase project.
2. Run `database/schema.sql` in the Supabase SQL Editor to create tables, RLS policies and helper functions.
<!-- 3. Enable email/password auth in the Supabase Dashboard. -->
3. Configure GitHub OAuth in the Supabase Dashboard.

### 4. Run Development Server

```bash
npm run dev
```

