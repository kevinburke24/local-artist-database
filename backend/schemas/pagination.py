from pydantic import BaseModel
from typing import List
from .artist import ArtistResponse

class ArtistListResponse(BaseModel):
    total: int
    page: int
    limit: int
    artists: List[ArtistResponse]