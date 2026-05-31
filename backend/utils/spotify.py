import logging
import os
import re
import requests
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE = "https://api.spotify.com/v1"


def get_access_token() -> str:
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
    if not client_id or not client_secret:
        raise RuntimeError("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set")
    resp = requests.post(
        SPOTIFY_TOKEN_URL,
        data={"grant_type": "client_credentials"},
        auth=(client_id, client_secret),
    )
    resp.raise_for_status()
    return resp.json()["access_token"]


def extract_artist_id(spotify_url: str) -> str | None:
    """Extract the artist ID from a Spotify artist URL."""
    m = re.search(r"/artist/([A-Za-z0-9]+)", spotify_url)
    return m.group(1) if m else None


def get_artist_followers(spotify_url: str, access_token: str) -> int | None:
    """Return follower count for the artist at spotify_url, or None on failure."""
    artist_id = extract_artist_id(spotify_url)
    if not artist_id:
        return None
    resp = requests.get(
        f"{SPOTIFY_API_BASE}/artists/{artist_id}",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    if resp.status_code == 404:
        return None
    resp.raise_for_status()
    return resp.json()["followers"]["total"]


def sync_all_artists(db) -> dict:
    """Fetch and update Spotify followers for all artists with a Spotify URL."""
    from models.artist import Artist

    artists = db.query(Artist).filter(Artist.spotify_url.isnot(None)).all()
    if not artists:
        return {"updated": 0, "failed": 0}

    try:
        token = get_access_token()
    except Exception as e:
        logger.error("Spotify token fetch failed: %s", e)
        return {"updated": 0, "failed": len(artists)}

    updated = 0
    failed = 0
    for artist in artists:
        try:
            followers = get_artist_followers(artist.spotify_url, token)
            if followers is not None:
                artist.spotify_followers = followers
                artist.spotify_followers_updated_at = datetime.now(timezone.utc)
                updated += 1
            else:
                failed += 1
        except Exception as e:
            logger.warning("Failed to fetch followers for artist %s: %s", artist.id, e)
            failed += 1
    db.commit()
    logger.info("Spotify sync complete: updated=%d failed=%d", updated, failed)
    return {"updated": updated, "failed": failed}
