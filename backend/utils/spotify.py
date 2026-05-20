import os
import re
import requests

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
