#!/usr/bin/env python3
"""
Sync Spotify follower counts for all artists with a spotify_url.

Run monthly via cron or Railway cron service:
    cd /path/to/repo
    source backend/venv/bin/activate
    python -m backend.scripts.sync_spotify_followers

Requires env vars: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, DATABASE_URL
"""

import logging
from datetime import datetime, timezone

from backend.db.database import SessionLocal
from backend.models.artist import Artist
from backend.utils.spotify import get_access_token, get_artist_followers

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


def sync():
    db = SessionLocal()
    try:
        artists = db.query(Artist).filter(Artist.spotify_url.isnot(None)).all()
        logger.info("Syncing Spotify followers for %d artists", len(artists))

        token = get_access_token()
        updated = 0
        failed = 0

        for artist in artists:
            try:
                followers = get_artist_followers(artist.spotify_url, token)
                if followers is not None:
                    artist.monthly_listeners = followers
                    artist.spotify_followers_updated_at = datetime.now(timezone.utc)
                    updated += 1
                    logger.info("  %s -> %d followers", artist.stage_name, followers)
                else:
                    logger.warning(
                        "  %s: could not extract artist ID from %s",
                        artist.stage_name,
                        artist.spotify_url,
                    )
                    failed += 1
            except Exception as e:
                logger.error("  %s: error - %s", artist.stage_name, e)
                failed += 1

        db.commit()
        logger.info("Done: %d updated, %d failed", updated, failed)
    finally:
        db.close()


if __name__ == "__main__":
    sync()
