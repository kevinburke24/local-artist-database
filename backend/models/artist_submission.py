import enum
from sqlalchemy import (
    Column, Integer, String, DateTime, Text, Enum, func, TIMESTAMP
)
from backend.db.database import Base  # adjust import to your Base
from sqlalchemy import DateTime

class SubmissionStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class ArtistSubmission(Base):
    __tablename__ = "artist_submissions"
    id = Column(Integer, primary_key=True, index=True)
    # moderation
    status = Column(Enum(SubmissionStatus, name="submission_status"), nullable=False, default=SubmissionStatus.pending)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    # spam / metadata
    submitter_ip = Column(String(64), nullable=True)           # store IP string (or hash later)
    user_agent = Column(String(256), nullable=True)

    # honeypot (DO NOT show in UI)
    honeypot = Column(String(256), nullable=True)

    # submission fields
    email = Column(String(254), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    stage_name = Column(String(200), nullable=False)
    zip_code = Column(String(10), nullable=False)
    neighborhood = Column(String(50), nullable=True)
    genre = Column(String(80), nullable=False)
    bio = Column(Text, nullable=True)
    email_verified_at = Column(DateTime(timezone=True), nullable=True)
    verify_token_hash = Column(String(128), nullable=False)
    verify_token_expires_at = Column(DateTime(timezone=True), nullable=False)
    approved_artist_id = Column(Integer, nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    review_notes = Column(Text, nullable=True)

    spotify_url = Column(Text, nullable=True)
    youtube_url = Column(Text, nullable=True)
