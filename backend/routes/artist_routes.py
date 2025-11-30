from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.db.database import SessionLocal
from backend.models.artist import Artist
from backend.schemas.artist import ArtistCreate, ArtistResponse
from backend.schemas.pagination import ArtistListResponse

router = APIRouter(prefix="/artists", tags=["Artists"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ArtistResponse)
def create_artist(artist: ArtistCreate, db: Session = Depends(get_db)):
    db_artist = Artist(**artist.dict())
    db.add(db_artist)
    db.commit()
    db.refresh(db_artist)
    return db_artist

@router.get("/{artist_id}", response_model=ArtistResponse)
def get_artist(artist_id: int, db: Session = Depends(get_db)):
    db_artist = db.query(Artist).filter(Artist.id == artist_id).first()
    if not db_artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return db_artist

@router.get("/", response_model=ArtistListResponse)
def list_artists(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    zip_code: str | None = None,
    genre: str | None = None,
    first_name: str | None = None,
    last_name: str | None = None,
    min_listeners: int | None = None,
    max_listeners: int | None = None,
    sort_by: str = Query("last_name"),
    sort_order: str = Query("asc"),
    db: Session = Depends(get_db)
):
    query = db.query(Artist)

    if zip_code:
        query = query.filter(Artist.zip_code == zip_code)

    if genre:
        query = query.filter(Artist.genre == genre)

    if first_name:
        query = query.filter(Artist.first_name.ilike(f"%{first_name}%"))

    if last_name:
        query = query.filter(Artist.last_name.ilike(f"%{last_name}%"))

    if min_listeners is not None:
        query = query.filter(Artist.monthly_listeners >= min_listeners)

    if max_listeners is not None:
        query = query.filter(Artist.monthly_listeners <= max_listeners)

    # adding sorting logic

    valid_sort_fields = {
        "last_name" : Artist.last_name,
        "monthly_listeners" : Artist.monthly_listeners,
        "created_at" : Artist.created_at
    }

    if sort_by not in valid_sort_fields:
        raise HTTPException(status_code=400, detail="Invalid sort field")

    sort_column = valid_sort_fields[sort_by]

    if sort_order.lower() == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    # pagination
    skip = (page-1) * limit
    artists = query.offset(skip).limit(limit).all()
    total = query.count()

    return {
        "total" : total,
        "page" : page,
        "limit" : limit,
        "artists" : artists
    }