from pydantic import BaseModel, Field, validator
from typing import Optional

VALID_GENRES = {"indie", "rock", "pop", "soul", "country", "hiphop", "folk"}

class ArtistQueryParams(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    stage_name: Optional[str] = None
    genre: Optional[str] = None
    zip_code: str = Field(..., pattern=r"^\d{5}$")
    radius: int = Field(10, ge=1, le=200)
    neighborhood: Optional[str] = None
    min_listeners: Optional[int] = Field(None, ge=0)
    max_listeners: Optional[int] = Field(None, ge=0)
    page: int = Field(1, ge=1)
    limit: int = Field(20, ge=1, le=100)

    @validator("genre")
    def validate_genre(cls, v):
        if v and v.lower() not in VALID_GENRES:
            raise ValueError("Invalid genre")
        return v
    