from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, Index
from sqlalchemy.sql import func
from backend.db.database import Base

class Artist(Base):
    __tablename__ = "artists"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(10), nullable=False)
    zip_code = Column(String(10), nullable=False)
    genre = Column(String(50), nullable=False)
    monthly_listeners = Column(Integer)
    spotify_url = Column(Text)
    youtube_url = Column(Text)
    bio = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())

    __table_args__ = (
        Index("idx_genre", "genre"),
        Index("idx_zip", "zip_code"),
        Index("idx_listeners", "monthly_listeners")
    )