# The Situations Vacant — MERN Job Portal

A full-stack job portal with two account roles:

- **Applicants** — browse/search listings, apply with a cover letter + resume link, track application status.
- **Employers** — post/edit/delete job listings, view applicants per job, move applications through a status pipeline (submitted → under review → interview → hired/rejected).

Stack: MongoDB + Express + React (Vite) + Node, styled with **Tailwind CSS**, with JWT auth and role-based route protection on both the API and the frontend.

Full feature list:
- JWT auth with two roles: **applicant** and **employer**
- Job browsing/search/filtering by keyword, location, category, and type, with a live category-count sidebar
- Apply to jobs with a real resume file upload (PDF/DOC/DOCX) and an optional cover letter; track application status
- Resume management — upload/replace a standing resume on your applicant profile
- **Saved jobs** — bookmark any listing and view them all on `/saved-jobs`
- Employer dashboard — post, edit, delete, and **open/close** job listings
- View applicants per job, with resume download links and a status pipeline (submitted → under review → interview → hired/rejected)
- **Company profile** — employers can upload a logo and set a company description/website, shown on their job cards
- Responsive layout (mobile/tablet/desktop) via Tailwind's responsive utilities

## Project structure

```
mern-job-portal/
  backend/     Express API, MongoDB models, JWT auth
  frontend/    React app (Vite)
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/job-portal
JWT_SECRET=some_long_random_string
CLIENT_URL=http://localhost:5173
```

You need a MongoDB instance — either install MongoDB locally, run it via Docker
(`docker run -d -p 27017:27017 mongo`), or use a free MongoDB Atlas cluster and
paste its connection string into `MONGO_URI`.

Run the API:

```bash
npm run dev      # nodemon, auto-restarts
# or
npm start
```

The API runs on `http://localhost:5000/api`. Check `GET /api/health` to confirm it's up.

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend uses Tailwind CSS (configured via `tailwind.config.js` /
`postcss.config.js`, applied through `src/index.css`) — `npm install` pulls
in `tailwindcss`, `postcss`, and `autoprefixer` automatically, no extra setup
needed.

The app runs on `http://localhost:5173`. It talks to the API at
`http://localhost:5000/api` by default — override with a `VITE_API_URL` env
var if your API lives elsewhere.

## 3. Try it out

1. Register an **employer** account (needs a company name).
2. From the Employer Desk, post a job.
3. Log out, register an **applicant** account.
4. Browse listings, open one, and submit an application.
5. Log back in as the employer to see the applicant and move their status
   through the pipeline.

## API overview

| Method | Route                              | Access             |
|--------|-------------------------------------|--------------------|
| POST   | /api/auth/register                  | Public             |
| POST   | /api/auth/login                     | Public             |
| GET    | /api/auth/me                        | Authenticated      |
| PUT    | /api/auth/me                        | Authenticated      |
| GET    | /api/jobs                           | Public (filters: q, category, type, remote, location, page, limit) |
| GET    | /api/jobs/:id                       | Public             |
| GET    | /api/jobs/categories/counts         | Public             |
| GET    | /api/jobs/mine                      | Employer           |
| GET    | /api/jobs/saved/mine                | Applicant          |
| POST   | /api/jobs                           | Employer           |
| POST   | /api/jobs/:id/save                  | Applicant (toggle save/unsave) |
| PUT    | /api/jobs/:id                       | Employer (own job) — also used to open/close a listing via `status` |
| DELETE | /api/jobs/:id                       | Employer (own job) |
| POST   | /api/applications/job/:jobId        | Applicant          |
| GET    | /api/applications/mine              | Applicant          |
| GET    | /api/applications/job/:jobId        | Employer (own job) |
| PUT    | /api/applications/:id/status        | Employer (own job) |
| POST   | /api/auth/me/resume                 | Applicant (upload/replace resume) |
| POST   | /api/auth/me/logo                   | Employer (upload/replace company logo) |

## Resume uploads

Applicants can upload a real PDF/DOC/DOCX resume (5MB max), either once to
their profile (`My Profile`) or per-application from the job page. Files are
stored on local disk under `backend/uploads/resumes/` and served statically
at `http://localhost:5000/uploads/resumes/<filename>`.

| Method | Route                  | What it does                                    |
|--------|-------------------------|--------------------------------------------------|
| POST   | /api/auth/me/resume     | Upload/replace the resume on an applicant's profile |
| POST   | /api/applications/job/:jobId | Apply to a job; accepts an optional `resume` file, falls back to the profile resume if none is attached |

**Moving to S3 (or another cloud store) later:** all the upload logic is
isolated in `backend/middleware/upload.js`. Swap the `multer.diskStorage`
engine for `multer-s3` (or similar), point `resumeUrl` at the returned S3 key
/ signed URL instead of `/uploads/resumes/...`, and nothing else in the app
needs to change — routes and controllers only ever read `req.file`.

In production, don't serve resumes from a public static folder as-is; use
signed, time-limited URLs so only the employer who owns the job (and the
applicant themselves) can fetch a given file.

## Notes & next steps

- Passwords are hashed with bcrypt; sessions are stateless JWTs (7-day expiry) stored in `localStorage`.
- No email notifications yet — a natural next step would be notifying applicants when their status changes.
- Add indexes/pagination tuning before using this with a large dataset in production.
