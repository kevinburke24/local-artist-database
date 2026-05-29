from sqlalchemy import Column, Integer, DOUBLE_PRECISION, String, Text, TIMESTAMP, Index, create_engine
from sqlalchemy.sql import func
from backend.db.database import Base

class Artist(Base):
    __tablename__ = "artists"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    stage_name = Column(String(50), nullable=False)
    zip_code = Column(String(5), nullable=False)
    city = Column(String(50), nullable=True)
    state = Column(String(2), nullable=True)
    latitude = Column(DOUBLE_PRECISION)
    longitude = Column(DOUBLE_PRECISION)
    neighborhood = Column(String(50), nullable=True)
    genre = Column(String(50), nullable=False)
    monthly_listeners = Column(Integer)
    spotify_url = Column(Text)
    youtube_url = Column(Text)
    soundcloud_url = Column(Text)
    instagram_url = Column(Text)
    bio = Column(Text)
    email = Column(String(254), nullable=True)
    edit_token_hash = Column(String(128), nullable=True)
    edit_token_expires_at = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())
    spotify_followers_updated_at = Column(TIMESTAMP(timezone=True), nullable=True)

    __table_args__ = (
        Index("idx_genre", "genre"),
        Index("idx_zip", "zip_code"),
        Index("idx_listeners", "monthly_listeners")
    )
