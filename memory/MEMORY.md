# Project Memory

## Stack
- FastAPI backend (Railway) + React/TypeScript frontend (Vercel)
- PostgreSQL on Railway
- Run backend from repo root: `source backend/venv/bin/activate && uvicorn backend.app:app --reload`
- `requirements.txt` is at repo root (not inside `backend/`)

## In-Progress: Spotify Followers Sync (started 2026-03-05)

Added auto-sync of Spotify follower counts into the `monthly_listeners` column.

### What was done
- `backend/utils/spotify.py` — Spotify Client Credentials auth + follower fetch via official API
- `backend/scripts/sync_spotify_followers.py` — batch sync script
- `backend/models/artist.py` — added `spotify_followers_updated_at` column
- `backend/routes/artist_routes.py` — added `POST /artists/admin/sync-spotify` endpoint
- `frontend/src/components/ArtistTable.tsx` — renamed "Listeners" → "Spotify Followers"
- `requirements.txt` — added `requests`

### Still needs to be done
1. **User must create a Spotify app** at developer.spotify.com and add to `backend/.env` and Railway:
   ```
   SPOTIFY_CLIENT_ID=...
   SPOTIFY_CLIENT_SECRET=...
   ```
2. **DB migration** — new column won't be auto-added by `create_all`:
   ```sql
   ALTER TABLE artists ADD COLUMN IF NOT EXISTS spotify_followers_updated_at TIMESTAMPTZ;
   ```
3. **Schedule monthly** — Railway cron or manual trigger via `POST /artists/admin/sync-spotify` with `X-Admin-Token` header

### Not committed yet
All changes are uncommitted local working tree changes.
