<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- The application lives in the `ridehost/` subdirectory. Run all `npm` commands from `ridehost/` (the repo root only holds a README). Standard scripts are in `ridehost/package.json`: `npm run dev` (Next.js dev server on port 3000), `npm run build`, `npm run start`, `npm run lint`. There is no test framework/`test` script configured.
- Tech stack: Next.js 16 (Turbopack) + React 19 + TypeScript + Tailwind v4. Requires Node 20+ (Node 22 works).
- There is no backend, database, or API layer. All data is mocked in `data/mock-data.ts`, and user/session state (auth, KYC verification status, bookings) is held client-side via a Zustand `persist` store in `lib/store.ts` backed by browser `localStorage`. Clearing browser storage resets all state (verification, bookings, etc.).
- Booking is gated by KYC: clicking "Book Now" on a car shows a "Profile Verification Required" gate until the user is verified. To test booking end-to-end, upload the 3 documents at `/profile?tab=verification`, submit, then approve the request in the admin panel at `/admin`. After approval the verification gate is bypassed and booking flows through the (simulated) UPI payment to a confirmation screen. Document uploads accept any image and are stored as data URLs, so any small JPG/PNG works.
- `npm run lint` currently reports pre-existing ESLint errors/warnings from the application code (not caused by environment setup); the command itself runs fine.
