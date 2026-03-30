# d20.build

Web-based D&D 5e character builder inspired by Aurora Builder.

## Repo Layout

- `web/` - the actual Next.js application

The research materials, local Aurora clone, desktop Aurora app files, and planning notes live outside the committed app surface and are intentionally not part of this repository.

## Vercel

When importing this repository into Vercel:

- Framework Preset: `Next.js`
- Root Directory: `web`
- Build Command: default
- Output Directory: default
- Install Command: default

## Environment Variables

The app currently expects:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

For local development, see `web/.env.example`.
