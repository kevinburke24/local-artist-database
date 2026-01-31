from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from urllib.parse import urlparse

ALLOWED_DOMAINS = {
    "open.spotify.com",
    "spotify.com",
    "youtube.com",
    "www.youtube.com",
}

def _is_valid_http_url(url: str) -> bool:
    try:
        u = urlparse(url)
        return u.scheme in ("http", "https") and bool(u.netloc)
    except Exception:
        return False

class ArtistSubmissionCreate(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=200)
    last_name: str = Field(..., min_length=1, max_length=200)
    stage_name: str = Field(..., min_length=2, max_length=200)
    email: EmailStr

    zip_code: Optional[str] = Field(default=None, max_length=10)
    genre: Optional[str] = Field(default=None, max_length=80)

    spotify_url: Optional[str] = None
    youtube_url: Optional[str] = None

    bio: Optional[str] = Field(default=None, max_length=2000)

    neighborhood: Optional[str] = Field(default=None, max_length=2000)

    # honeypot field (frontend hides it)
    company: Optional[str] = None

    @field_validator("zip_code")
    @classmethod
    def validate_zip(cls, v: Optional[str]):
        if v is None or v == "":
            return None
        s = v.strip()
        # simple US zip check (you can tighten later)
        if len(s) >= 5 and s[:5].isdigit():
            return s[:5]
        raise ValueError("zip_code must start with 5 digits")

    @field_validator("spotify_url", "youtube_url")
    @classmethod
    def validate_urls(cls, v: Optional[str]):
        if v is None or v.strip() == "":
            return None
        url = v.strip()
        if not _is_valid_http_url(url):
            raise ValueError("Invalid URL")
        return url

    @field_validator("youtube_url")
    @classmethod
    def validate_domain(cls, v: Optional[str]):
        if not v:
            return v
        host = urlparse(v).netloc.lower()
        if host not in ALLOWED_DOMAINS:
            # be permissive if you want; this is optional
            return v
        return v

    @field_validator("spotify_url", "youtube_url")
    @classmethod
    def strip_url(cls, v: Optional[str]):
        return v.strip() if v else v

class RejectBody(BaseModel):
    reason: Optional[str] = None