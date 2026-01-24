from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ArtistBase(BaseModel):
    first_name: str
    last_name: str
    stage_name: str
    zip_code: str
    neighborhood: str
    genre: str
    monthly_listeners: Optional[int] = None
    spotify_url: Optional[str] = None
    youtube_url: Optional[str] = None
    bio: Optional[str] = None

class ArtistCreate(ArtistBase):
    pass

class ArtistResponse(ArtistBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True