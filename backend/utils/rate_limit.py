from datetime import datetime, timedelta, timezone
from sqlalchemy import func
from backend.models.artist_submission import ArtistSubmission

def too_many_recent_submissions(db, ip: str, limit: int = 3, window_minutes: int = 60) -> bool:
    since = datetime.now(timezone.utc) - timedelta(minutes=window_minutes)
    count = (
        db.query(func.count(ArtistSubmission.id))
        .filter(ArtistSubmission.submitter_ip == ip)
        .filter(ArtistSubmission.created_at >= since)
        .scalar()
    )
    return (count or 0) >= limit