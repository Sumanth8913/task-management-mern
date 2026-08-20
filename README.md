# Task Management MERN Application

A production-style task management web application built on the MERN stack (MongoDB, Express, React, Node.js). Users register, log in, and manage their own tasks — with search, filters, sorting, pagination, file attachments, live weather for task locations, and email notifications on task creation and completion.

## Overview

This app is for anyone who wants a straightforward, secure, multi-user task tracker: individuals organizing personal to-dos, or a small team where each person needs their own private task list. Every task belongs to exactly one user, and the backend enforces that ownership on every read, write, and delete — a user can never see or touch another user's tasks, even by guessing an ID.

## Features

- **Authentication** — register, login, logout, session check (`/me`), JWT-based, bcrypt password hashing
- **Authorization** — every task operation is scoped to `req.user._id`; ownership is checked server-side, never trusted from the client
- **Task CRUD** — create, read, update, delete, with status (`PENDING` / `IN_PROGRESS` / `DONE`) and priority (`LOW` / `MEDIUM` / `HIGH`)
- **Search** — full-text search across title, description, and location
- **Filtering** — by status, priority, and due-date range
- **Sorting** — newest, oldest, due soonest, due latest, priority
- **Pagination** — server-side, with a capped page size
- **File attachments** — upload via Multer + Cloudinary (JPG, PNG, PDF, DOC, DOCX; 10MB limit)
- **Live weather** — OpenWeatherMap lookup for a task's location, cached server-side for 10 minutes
- **Email notifications** — sent on task creation and on the `PENDING/IN_PROGRESS → DONE` transition only (no duplicate completion emails); email failures never block the task operation itself
- **Dashboard** — real counts (total, pending, in progress, completed, high priority) and upcoming deadlines, computed from actual data
- **Responsive, accessible UI** — Tailwind CSS, semantic HTML, keyboard-navigable dialogs, labeled forms

## Tech Stack

**Frontend:** React 18, Vite, React Router, Axios, TanStack Query, Tailwind CSS, Lucide icons
**Backend:** Node.js, Express, Mongoose, MongoDB, JWT, bcryptjs, Multer, Cloudinary, Nodemailer
**External APIs:** OpenWeatherMap (weather), SMTP provider of your choice (email)

## Architecture

```
React (Vite)
   │  Axios + TanStack Query
   ▼
Express REST API  ──►  MongoDB (Mongoose)
   │
   ├──► Cloudinary (attachment storage)
   ├──► OpenWeatherMap (task-location weather)
   └──► SMTP (task-created / task-completed emails)
```

The frontend never talks to Cloudinary, OpenWeatherMap, or the SMTP provider directly — all third-party calls happen server-side so API keys and secrets never reach the browser.

## Folder Structure

```
task-management-mern/
├── backend/
│   ├── config/          db.js, cloudinary.js
│   ├── controllers/     authController.js, taskController.js
│   ├── middleware/      authMiddleware.js, uploadMiddleware.js, errorMiddleware.js
│   ├── models/          User.js, Task.js
│   ├── routes/          authRoutes.js, taskRoutes.js
│   ├── services/        emailService.js, weatherService.js
│   ├── validators/      authValidator.js, taskValidator.js
│   ├── utils/           asyncHandler.js, apiResponse.js
│   ├── tests/           auth.test.js, task.test.js
│   ├── .env.example
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/  Navbar, Sidebar, TaskCard, TaskFormModal, TaskDetails,
│   │   │                WeatherBadge, SearchBar, FilterPanel, Pagination,
│   │   │                ConfirmDialog, LoadingState, EmptyState, ProtectedRoute
│   │   ├── context/      AuthContext.jsx
│   │   ├── hooks/        useAuth.js, useTasks.js
│   │   ├── pages/        LoginPage, RegisterPage, DashboardPage, TasksPage,
│   │   │                TaskDetailsPage, ProfilePage, NotFoundPage
│   │   ├── services/     api.js, authService.js, taskService.js, weatherService.js
│   │   └── utils/        formatDate.js, validation.js
│   └── .env.example
└── README.md
```

## Prerequisites

- Node.js 18+
- npm
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Cloudinary](https://cloudinary.com) account (free tier is enough) — for attachments
- An [OpenWeatherMap](https://openweathermap.org/api) API key — for weather
- An SMTP account (e.g. Gmail app password, Mailtrap, SendGrid, Resend SMTP) — for email

The app runs and the core task CRUD works even without Cloudinary/OpenWeatherMap/SMTP configured — those features degrade gracefully (see "Known Limitations").

## Installation

```bash
git clone <repository-url>
cd task-management-mern
cd backend
npm install
cd ../frontend
npm install
```

## Environment Setup

### Backend (`backend/.env`, copy from `backend/.env.example`)

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Backend port, default `5000` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Frontend origin, for CORS, e.g. `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |
| `OPENWEATHER_API_KEY` | From your OpenWeatherMap account |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` | Your SMTP provider's credentials |
| `EMAIL_FROM` | Sender display name/address for outgoing emails |

### Frontend (`frontend/.env`, copy from `frontend/.env.example`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL, e.g. `http://localhost:5000/api` |

Never put backend secrets (JWT secret, Cloudinary/SMTP/weather keys) into a `VITE_*` variable — anything prefixed `VITE_` is bundled into the client-side JavaScript and is publicly visible.

## MongoDB Setup

**Local:** install MongoDB Community Edition, run `mongod`, and use `MONGO_URI=mongodb://localhost:27017/task_management`.

**Atlas:** create a free cluster, add a database user, allow your IP (or `0.0.0.0/0` for development), and copy the provided connection string into `MONGO_URI`.

## Cloudinary Setup

Create a free account at cloudinary.com, then copy the **Cloud name**, **API Key**, and **API Secret** from your dashboard into the backend `.env`. Attachments are uploaded via a server-side stream — no signed upload widget or client-side key is required.

## Weather Setup

Sign up at openweathermap.org, generate an API key (new keys can take up to a couple of hours to activate), and set `OPENWEATHER_API_KEY`. Without this key, `GET /api/tasks/:id/weather` returns a `503` and the frontend shows "Weather unavailable" instead of fabricating data.

## Email Setup

Use any standard SMTP provider. For Gmail, generate an [app password](https://myaccount.google.com/apppasswords) and use `smtp.gmail.com`, port `587`. For testing, [Mailtrap](https://mailtrap.io) is a good sandbox that won't send real emails. Without SMTP configured, emails are skipped and logged server-side — task creation and completion still succeed.

## Running Locally

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend** (in a second terminal):
```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5000`.

## API Documentation

All responses share the shape `{ success, data }` on success or `{ success: false, message, details? }` on error. Task endpoints require `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Auth | Body | Notes |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | `{ name, email, password }` | Returns `{ user, token }`. Rate-limited. |
| POST | `/api/auth/login` | No | `{ email, password }` | Returns `{ user, token }`. Rate-limited. |
| GET | `/api/auth/me` | Yes | — | Returns the current user. |
| POST | `/api/auth/logout` | Yes | — | Stateless; client discards the token. |

### Tasks

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/tasks` | Yes | Query: `page, limit, search, status, priority, startDate, endDate, sort`. Returns `{ tasks }` + `meta: { total, page, limit, totalPages, hasNextPage, hasPreviousPage }`. |
| POST | `/api/tasks` | Yes | Multipart form: `title, description, status, priority, dueDate, location, attachment`. |
| GET | `/api/tasks/:id` | Yes | 404 if the task doesn't belong to the caller. |
| PATCH | `/api/tasks/:id` | Yes | Partial update, multipart. Sets `completedAt` only on the transition into `DONE`. |
| DELETE | `/api/tasks/:id` | Yes | Also deletes any Cloudinary attachments. |
| GET | `/api/tasks/:id/weather` | Yes | 400 if the task has no location; 503 if weather isn't configured. |

Possible errors: `400` validation, `401` missing/invalid/expired token, `404` not found or not owned by caller, `409` duplicate email on register, `429` too many auth attempts, `500` unexpected server error.

## Testing

```bash
cd backend
npm test
```

Tests use `mongodb-memory-server` to spin up an ephemeral MongoDB instance — no external database is touched. They cover registration, duplicate-email rejection, login, protected-route access, task CRUD, the `completedAt` transition logic, ownership isolation between two different users, filtering, pagination (including page-size capping), and rejection of invalid JWTs.

> Note: `mongodb-memory-server` downloads a MongoDB binary on first run. If your environment blocks that download, point `MONGO_URI` at a real local/Atlas instance and adapt the test setup, or run the tests in an environment with unrestricted network access.

## Deployment

**Database:** MongoDB Atlas — create a cluster, get the connection string.

**Backend:** Render, Railway, or Fly.io. Set the environment variables listed above, set the start command to `npm start` (or `node server.js`), and set `CLIENT_URL` to your deployed frontend's origin so CORS allows it.

**Frontend:** Vercel or Netlify. Set `VITE_API_BASE_URL` to your deployed backend's `/api` URL as a build-time environment variable, build command `npm run build`, output directory `dist`.

**CORS:** the backend only allows requests from `CLIENT_URL`; update it whenever you change the frontend's deployed domain.

No `localhost` URLs are hardcoded — both origins are environment-driven.

## Security Notes

- Passwords hashed with bcrypt (10 salt rounds) before storage; never returned in API responses
- JWTs signed with `JWT_SECRET`, verified on every protected request; the secret never reaches the frontend
- Every task query/update/delete is scoped by `{ _id: taskId, user: req.user._id }` — ownership is enforced at the database query level, not just checked in application code after the fact
- Uploaded files are validated by MIME type and capped at 10MB
- `helmet` sets standard security headers; CORS is restricted to `CLIENT_URL`
- Auth endpoints are rate-limited (20 requests / 15 minutes per IP) to slow down credential stuffing

This is a reasonable baseline for a small-to-medium application, not a claim of "100% secure" — a production deployment handling sensitive data should add things like refresh-token rotation, audit logging, and a WAF.

## Known Limitations

- No password-reset / "forgot password" flow
- No email verification on signup
- JWTs are not revocable before expiry (no server-side blocklist) — logout is client-side only
- Dashboard stats are computed client-side from a capped recent-tasks fetch (50 tasks) rather than a dedicated aggregation endpoint, so extremely large task lists won't be perfectly represented in the "total" counts shown on the dashboard vs. the full `/api/tasks` count
- Weather is looked up by free-text city name (no geocoding/disambiguation for ambiguous city names)
- No real-time updates (e.g. WebSockets) between multiple open tabs/devices for the same user

## Future Improvements

- Task reminders (email/push before a due date)
- Recurring tasks
- Calendar view / calendar app integration
- Team workspaces with shared tasks and role-based access
- In-app notifications, not just email
- Refresh tokens with rotation and server-side revocation
