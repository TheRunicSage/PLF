# Final Deployment Guide (Vercel)

This project is configured to deploy **frontend + backend API** on a single Vercel project.

## 1. What is already configured

- Root `vercel.json` is set to:
  - install both `server` and `client` dependencies
  - build the Vite frontend from `client/`
  - publish static output from `client/dist`
  - expose backend API through `api/[...route].mjs`
- Serverless API adapter:
  - `api/[...route].mjs` boots Express app from `server/src/app.js`
  - reuses MongoDB connection through cached `connectDB()`
- SPA rewrites are set for all React routes (including policy and admin paths).

## 2. Prerequisites

- A Vercel account
- A MongoDB database URI (Atlas recommended)
- Strong production secrets:
  - `JWT_SECRET`
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`

## 3. Environment variables (Vercel Project Settings -> Environment Variables)

Add these variables for **Production** (and Preview if needed):

- `MONGODB_URI` = your Mongo connection string
- `JWT_SECRET` = long random secret
- `JWT_EXPIRES_IN` = `1d` (or your preferred expiry)
- `ADMIN_EMAIL` = admin login email
- `ADMIN_PASSWORD` = admin login password
- `CORS_ORIGIN` = your Vercel app domain(s), comma-separated if multiple
  - Example: `https://your-app.vercel.app,https://www.yourdomain.com`
- `NODE_ENV` = `production`

Notes:
- `VITE_API_BASE_URL` is **optional** for this architecture.
- Leave `VITE_API_BASE_URL` unset to use default `/api` on same domain.

## 4. Deploy from Vercel Dashboard

1. Open Vercel -> **Add New...** -> **Project**
2. Import this repository
3. Keep project **Root Directory** as repository root (`PLF`)
4. Framework can stay auto-detected
5. Confirm Vercel picks `vercel.json` (it will use:
   - `installCommand`: `npm run install:all`
   - `buildCommand`: `npm run build:client`
   - `outputDirectory`: `client/dist`)
6. Add environment variables listed above
7. Click **Deploy**

## 5. Post-deploy checks

After deployment completes, verify:

1. `GET https://<your-domain>/api/health` returns success JSON
2. Public routes open directly (refresh-safe):
   - `/`
   - `/about`
   - `/projects`
   - `/blog`
   - `/donate`
   - `/contact`
   - `/privacy-policy`
   - `/terms-and-conditions`
   - `/refund-policy`
3. Admin login works at `/admin/login`
4. Admin CRUD pages call `/api/*` correctly

## 6. Seed production admin user

If admin user does not exist yet, run from local machine against production DB values:

1. In local `server/.env`, set:
   - `MONGODB_URI` (production DB)
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
2. Run:

```powershell
node server/src/scripts/seedAdminUser.js
```

Then sign in at `/admin/login`.

## 7. Rollback and troubleshooting

- If API fails with 500:
  - check `MONGODB_URI`, `JWT_SECRET`, and Mongo network access settings.
- If frontend loads but API calls fail:
  - confirm `/api/health` works
  - confirm `CORS_ORIGIN` includes exact deployed domain
- If route refresh returns 404:
  - confirm `vercel.json` is present at repo root and deployed.
