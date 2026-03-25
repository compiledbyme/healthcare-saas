# Healthcare SaaS Frontend

Modern B2B healthcare console built with React, TypeScript, Redux Toolkit, Firebase Auth, MUI 5, Recharts, and a custom service worker for offline cache + notifications.

## Features

- Email/password login via Firebase Authentication (protected routes, auth state persisted on refresh).
- Dashboard with KPIs, charts, and a “Send daily digest” notification trigger.
- Patient Management with grid/list toggle, shared data source (`src/data/patients.ts`), detail view with status updates and reminder notifications.
- Analytics page with cohort/condition charts.
- Service worker for offline cache and push/local notifications.
- Dark theme with MUI, responsive drawer layout, toast notifications.

## Prerequisites

- Node.js 18+ and npm.
- Firebase project with Email/Password sign-in enabled.
- Chrome (recommended) for testing notifications.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Environment variables: create a `.env` in repo root:
   ```bash
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_ENABLE_SW=true
   ```
3. Start dev server:
   ```bash
   npm start
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Testing notifications locally

- Keep `REACT_APP_ENABLE_SW=true`.
- In the app header, click “Enable Alerts” to grant permission.
- On Dashboard, click “Send daily digest” to trigger a service-worker notification; a toast also appears.
- From Patient Details, use “Send Reminder” for a targeted notification.

## Deployment (Vercel)

- `vercel.json` uses `@vercel/static-build` with `distDir: build`.
- Set the same env vars in Vercel Project Settings → Environment Variables.
- Default build command: `npm run build`; output: `build/`.

## Project structure (selected)

- `src/App.tsx` – routing, theme, providers.
- `src/components` – layout shell, patient list/grid, protected route.
- `src/pages` – Login, Dashboard, Patients, PatientDetails, Analytics.
- `src/store` – Redux store + slices (`auth`, `patients`, `ui`) and typed hooks.
- `src/hooks/useNotifications.ts` – permission + SW-backed notifications.
- `src/data/patients.ts` – seed patient data.
- `public/service-worker.js` – cache + push/local notification handling.

## Notes

- Demo credentials must exist in your Firebase Auth (e.g., create `chetan@gmail.com / Test@1234` there).
- `robots.txt` is removed; add it back if you need crawl rules.
