# Oppdragsportalen

Next.js 16 + Supabase app for signup/login and simple profile management, styled with Radix Themes.

## Stack

- Next.js 16, React 19, TypeScript
- Radix Themes/Icons, next-themes, Tailwind v4
- Supabase Auth + Postgres

## Setup

1. Install: `npm install`
2. Env: create `.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Run dev server: `npm run dev`

## Notes

- Auth uses SSR-aware Supabase client so cookies survive redirects.
- Signup also writes a profile row; settings lets you update name/email.
- Enable email/password auth in Supabase and keep env vars in sync for deploys.

---

> AI-generated with GPT-5.1-Codex-Max on 2026-01-19.
