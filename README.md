# Punjab Lit Foundation (MERN Monorepo)

## Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (local or Atlas)

## Local setup
1. Copy environment templates:
   - `server/.env.example` -> `server/.env`
   - `client/.env.example` -> `client/.env`
2. Fill required server envs:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `CORS_ORIGIN`
3. Install all dependencies:
   - `npm run install:all`
4. Run server + client:
   - `npm run dev`
5. Open:
   - Public site: `http://localhost:5173`
   - Admin: `http://localhost:5173/admin/login`

## Useful scripts
- Root:
  - `npm run dev`
  - `npm run test`
  - `npm run lint`
  - `npm run format`
  - `npm run format:check`
- Server:
  - `npm run dev --prefix server`
  - `npm run test --prefix server`
- Client:
  - `npm run dev --prefix client`
  - `npm run build --prefix client`

## Deployment notes
- Deploy `server/` to a Node host (Render/Railway/etc.)
  - Start command: `npm start`
  - Required envs: `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CORS_ORIGIN`
- Deploy `client/` to static hosting (Netlify/Vercel)
  - Build command: `npm run build`
  - Publish dir: `dist`
  - Required env: `VITE_API_BASE_URL` (e.g. `https://<backend-domain>/api`)

