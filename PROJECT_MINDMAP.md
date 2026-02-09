# Project Mindmap (PLF Monorepo)

## 1) Monorepo Root
- `package.json`
  - Root scripts for local multi-process dev (`client` + `server`)
  - Shared workflow scripts (`lint`, `format`, `test`)
- `DEPLOYMENT.md`
  - Existing deployment guidance (to be finalized for Vercel)
- `client/`
  - Vite + React app (public site + admin UI)
- `server/`
  - Express + MongoDB API and business logic

## 2) Client App (`client/`)
- Runtime
  - React 18
  - React Router (Browser routing)
  - Vite build system
- App shell
  - `src/App.jsx`
    - Public layout with shared `Header` and `Footer`
    - Admin routes rendered without public layout wrappers
  - `src/router.jsx`
    - Public routes: home, about, projects, blog, donate, contact, policy pages
    - Admin routes: login + protected dashboard pages
- Configuration
  - `src/config/api.js`
    - `API_BASE_URL` from `VITE_API_BASE_URL` or fallback `/api`
  - `src/config.js`
    - Shared `apiRequest` wrapper
    - Auth token helpers (`localStorage`, expiry checks)
- Content
  - `src/content/siteCopy.js`
    - Centralized copy for nav/footer/pages
    - Includes policy page content
- UI structure
  - `src/components/layout/`
    - `Header.jsx`, `Footer.jsx`
  - `src/components/common/`
    - `ProtectedRoute.jsx`
  - `src/components/motion/` + `src/components/Reveal.jsx`
    - Scroll reveal behavior and motion wrappers
- Pages
  - Public: `Home`, `About`, `Projects`, `ProjectDetail`, `BlogList`, `BlogDetail`, `Donate`, `Contact`, `PolicyPage`
  - Admin: `AdminLogin`, `AdminDashboard`, `AdminPosts`, `AdminProjects`, `AdminSettings`
- Styling
  - `src/styles/global.css`
  - `src/styles/reveal.css`

## 3) Server API (`server/`)
- Runtime
  - Node.js + Express
  - MongoDB via Mongoose
  - JWT auth for admin
- App composition
  - `src/app.js`
    - Security middleware (`helmet`, CORS, body size limits)
    - API route mounting under `/api`
    - Health endpoint (`/api/health`)
    - Not-found and centralized error middleware
  - `src/index.js`
    - Local/Node-host entrypoint (`connectDB()` + `app.listen(PORT)`)
- Configuration
  - `src/config/db.js`
    - Mongo connection using `MONGODB_URI`
- Route layers
  - Auth: `/api/auth/*`
  - Public content: `/api/posts`, `/api/projects`, `/api/events/upcoming`, `/api/settings`, `/api/contact`
  - Admin content: `/api/admin/posts`, `/api/admin/projects`, `/api/admin/settings`
- Data models
  - `AdminUser`, `Post`, `Project`, `ContactMessage`, `Settings`
- Utilities
  - Validation helpers + HTTP response helpers
  - Seed scripts for admin and sample content

## 4) Data and Control Flow
- Public user flow
  1. Browser requests React route
  2. React page calls `apiRequest(...)`
  3. Request goes to `/api/*`
  4. Express route/controller queries MongoDB
  5. JSON response returned to UI
- Admin flow
  1. Admin logs in via `/api/auth/login`
  2. JWT stored in `localStorage`
  3. Protected admin pages include `Authorization: Bearer <token>`
  4. Auth middleware validates token and allows CRUD operations

## 5) Deployment Shape Target (Vercel)
- Static frontend build output from `client/dist`
- Server API exposed as Vercel serverless function(s) under `/api/*`
- MongoDB as external managed service
- Environment variables configured in Vercel project settings
