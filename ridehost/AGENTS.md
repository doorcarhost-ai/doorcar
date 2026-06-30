<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- The application is the Next.js 16 + React 19 app in `ridehost/` (App Router, Turbopack). Run all commands from the `ridehost/` directory.
- Standard scripts live in `ridehost/package.json`: `npm run dev` (dev server on http://localhost:3000), `npm run build`, `npm run start`, `npm run lint`.
- The app is fully client/mock driven — all data comes from `data/mock-data.ts`. There is no backend, database, or required environment variable, so no services beyond the Next.js server need to run.
- Known pre-existing dev caveat: `next.config.ts` does not declare `images.remotePatterns`, so any page that server-renders `next/image` with the remote Unsplash hosts returns HTTP 500 under `next dev` (observed on `/`, `/trips`, and `/cars/[id]`). The production path (`npm run build` then `npm run start`) renders every route at HTTP 200. Pages whose remote images only mount client-side (e.g. `/cars`, `/booking/[carId]`, `/payment`) load fine in dev. This is application config, not an environment problem.
- `npm run lint` currently reports pre-existing errors/warnings in the app source; the lint toolchain itself works.
