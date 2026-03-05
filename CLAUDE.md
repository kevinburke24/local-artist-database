# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A FastAPI + React + TypeScript app for discovering local music artists by ZIP code radius. Artists can submit themselves through a moderated pipeline with email verification. Currently has data for the Boston/Cambridge/Somerville area.

**Hosting:** Frontend on Vercel, backend on Railway (PostgreSQL database also on Railway).

## Backend

### Setup & Running

```bash
cd /path/to/repo  # run from repo root, not from backend/
source backend/venv/bin/activate
uvicorn backend.app:app --reload
```

The backend venv is at `backend/venv/`. The app must be run from the repo root so that Python resolves `backend.*` imports correctly.

Environment variables (`backend/.env`):
- `DATABASE_URL` - PostgreSQL connection string
- `ADMIN_TOKEN` - token required in `X-Admin-Token` header for admin routes
- `SECRET_KEY` - used for token operations

### Key Files

- `backend/app.py` - FastAPI app entry point; configures CORS, rate limiting middleware, and includes routers
- `backend/db/database.py` - SQLAlchemy engine/session setup; reads `DATABASE_URL` from env
- `backend/routes/artist_routes.py` - All routes: artist CRUD, submissions, email verification, admin approval/rejection
- `backend/models/artist.py` - `Artist` table (includes `latitude`/`longitude` columns for geo queries)
- `backend/models/artist_submission.py` - `ArtistSubmission` table with `SubmissionStatus` enum (pending/approved/rejected)
- `backend/models/search_log.py` - Logs every search query for monitoring
- `backend/schemas/` - Pydantic models for request validation and response serialization
- `backend/utils/tokens.py` - Token generation and hashing for email verification
- `backend/data/uszips.csv` - Bundled ZIP→lat/lon lookup table (loaded once via `lru_cache`)

### Architecture Notes

**Geographic search:** `GET /artists` requires `origin_zip` and `radius`. The ZIP is resolved to lat/lon via `uszips.csv` (loaded into memory, cached). A bounding box prefilter narrows candidates before the full Haversine distance calculation in SQL.

**Submission pipeline:**
1. User POSTs to `/artists/artist-submissions` — a honeypot field, link requirement, and IP rate limit guard spam
2. A `verify_token_hash` is stored; the raw token is meant to be emailed to the submitter
3. User GETs `/artists/artist-submissions/verify?token=...` to verify their email
4. Admin reviews verified pending submissions via `/artists/admin/artist-submissions`
5. Admin POSTs to `/artists/admin/artist-submissions/{id}/approve` — this creates the `Artist` record from the submission, resolving lat/lon from the ZIP
6. Admin POSTs to `/artists/admin/artist-submissions/{id}/reject` with optional `reason`

**Admin auth:** All `/admin/*` routes use `Depends(require_admin)`, which checks the `X-Admin-Token` request header against the `ADMIN_TOKEN` env var.

**Rate limiting:** SlowAPI limits `GET /artists` to 10/second by remote IP. Submission spam is additionally rate-limited by a custom check in `backend/utils/rate_limit.py`.

## Frontend

### Setup & Running

```bash
cd frontend
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # tsc + vite build
npm run lint     # eslint
```

Environment variables (`frontend/.env`):
- `VITE_API_URL` - backend base URL (e.g., `http://localhost:8000`)

### Key Files

- `frontend/src/App.tsx` - Root component; manages ZIP/radius search state, pagination, and filter state; renders routes
- `frontend/src/ArtistDetail.tsx` - Detail page for a single artist (`/artists/:id`)
- `frontend/src/components/AddYourself.tsx` - Artist self-submission form (`/add-yourself`)
- `frontend/src/api/fetchArtists.ts` - Builds query string and calls `GET /artists`
- `frontend/src/api/submissions.ts` - Calls `POST /artists/artist-submissions`
- `frontend/src/components/ArtistFilters.tsx` - Filter controls (name, genre, zip, listener range)
- `frontend/src/components/ArtistTable.tsx` - Results table with links to detail pages

### Architecture Notes

The app has two states: a ZIP/radius entry screen (no `search` state), and a results screen (with `search` set). All filter state lives in `App.tsx`; `load()` is called via `useEffect` when `search` or `page` changes, and manually when the user clicks "Search" in filters.

Routes:
- `/` — ZIP entry or results list (depending on `search` state)
- `/artists/:id` — artist detail
- `/add-yourself` — submission form
