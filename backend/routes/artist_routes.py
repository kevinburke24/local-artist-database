from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import func
from sqlalchemy.orm import Session
from backend.db.database import SessionLocal
from backend.models.artist import Artist
from backend.models.search_log import SearchLog
from backend.schemas.artist import ArtistCreate, ArtistResponse
from backend.schemas.pagination import ArtistListResponse
from backend.schemas.artist_query import ArtistQueryParams
from backend.utils.errors import error
import math

router = APIRouter(prefix="/artists", tags=["Artists"])

limiter = Limiter(key_func=get_remote_address)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("", response_model=ArtistResponse)
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

EARTH_RADIUS_MI = 3959.0

def miles_distance_expr(lat0, lon0, lat_col, lon_col):
    """
    Returns a SQLAlchemy expression that computes distance (miles) between
    point (lat0, lon0) and columns (lat_col, lon_col) using Haversine-ish acos formula.
    """
    return EARTH_RADIUS_MI * func.acos(
        func.cos(func.radians(lat0)) *
        func.cos(func.radians(lat_col)) *
        func.cos(func.radians(lon_col) - func.radians(lon0)) +
        func.sin(func.radians(lat0)) *
        func.sin(func.radians(lat_col))
    )

def bounding_box(lat0, lon0, radius_miles):
    # Rough but good enough for prefiltering
    lat_delta = radius_miles / 69.0
    lon_delta = radius_miles / (69.0 * math.cos(math.radians(lat0)))
    return (lat0 - lat_delta, lat0 + lat_delta, lon0 - lon_delta, lon0 + lon_delta)

EARTH_RADIUS_MI = 3959.0

def miles_distance_expr(lat0, lon0, lat_col, lon_col):
    """
    Returns a SQLAlchemy expression that computes distance (miles) between
    point (lat0, lon0) and columns (lat_col, lon_col) using Haversine-ish acos formula.
    """
    return EARTH_RADIUS_MI * func.acos(
        func.cos(func.radians(lat0)) *
        func.cos(func.radians(lat_col)) *
        func.cos(func.radians(lon_col) - func.radians(lon0)) +
        func.sin(func.radians(lat0)) *
        func.sin(func.radians(lat_col))
    )

def bounding_box(lat0, lon0, radius_miles):
    # Rough but good enough for prefiltering
    lat_delta = radius_miles / 69.0
    lon_delta = radius_miles / (69.0 * math.cos(math.radians(lat0)))
    return (lat0 - lat_delta, lat0 + lat_delta, lon0 - lon_delta, lon0 + lon_delta)

def query_artists_within_radius(lat0, lon0, radius_miles, db):
    dist_expr = miles_distance_expr(lat0, lon0, Artist.latitude, Artist.longitude).label("distance_miles")

    lat_min, lat_max, lon_min, lon_max = bounding_box(lat0, lon0, radius_miles)

    q = (
        db.query(Artist, dist_expr)
        .filter(
            Artist.latitude.isnot(None),
            Artist.longitude.isnot(None),
            # bounding box prefilter (optional but recommended)
            Artist.latitude.between(lat_min, lat_max),
            Artist.longitude.between(lon_min, lon_max),
            # true radius filter
            dist_expr <= radius_miles,
        )
        .order_by(dist_expr.asc())
    )
    return q.all()

import csv
from functools import lru_cache
from pathlib import Path
from typing import Tuple

class ZipNotFoundError(Exception):
    pass

@lru_cache(maxsize=1)
def _load_zip_lat_lon_map(csv_path: str) -> dict[str, tuple[float, float]]:
    """
    Load ZIP → (lat, lon) map into memory.
    Cached so the CSV is read only once per process.
    """
    path = Path(csv_path)
    if not path.exists():
        raise FileNotFoundError(f"ZIP CSV not found: {csv_path}")

    zip_map: dict[str, tuple[float, float]] = {}

    with path.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        headers = {h.lower(): h for h in reader.fieldnames or []}

        zip_h = headers.get("zip") or headers.get("zipcode")
        lat_h = headers.get("lat") or headers.get("latitude")
        lon_h = headers.get("lng") or headers.get("lon") or headers.get("longitude")

        if not (zip_h and lat_h and lon_h):
            raise ValueError(
                f"CSV must contain zip, lat, lon columns. Found: {reader.fieldnames}"
            )

        for row in reader:
            z = row[zip_h].strip()
            if len(z) == 5 and z.isdigit():
                try:
                    zip_map[z] = (float(row[lat_h]), float(row[lon_h]))
                except ValueError:
                    # skip malformed rows
                    continue

    if not zip_map:
        raise ValueError("ZIP CSV contained no valid rows")

    return zip_map

def get_lat_lon_from_zip(zip_code: str, csv_path: str) -> Tuple[float, float]:
    """
    Given a 5-digit ZIP code, return (latitude, longitude).
    Raises ZipNotFoundError if ZIP is not present in CSV.
    """
    z = zip_code.strip()[:5]

    if len(z) != 5 or not z.isdigit():
        raise ValueError(f"Invalid ZIP code: {zip_code}")

    zip_map = _load_zip_lat_lon_map(csv_path)

    try:
        return zip_map[z]
    except KeyError:
        raise ZipNotFoundError(f"ZIP code not found: {z}")


@router.get("", response_model=ArtistListResponse)
@limiter.limit("10/second")
def list_artists(
    request: Request,
    params: ArtistQueryParams = Depends(),
    sort_by: str = Query("last_name"),
    sort_order: str = Query("asc"),
    db: Session = Depends(get_db)
):
    first_name = params.first_name
    last_name = params.last_name
    stage_name = params.stage_name
    genre = params.genre
    zip = params.zip_code
    radius = params.radius
    neighborhood = params.neighborhood
    min_listeners = params.min_listeners
    max_listeners = params.max_listeners
    page = params.page
    limit = params.limit

    log = SearchLog(
        first_name=first_name,
        last_name=last_name,
        stage_name=stage_name,
        genre=genre,
        zip_code=zip,
        neighborhood=neighborhood,
        min_listeners=min_listeners,
        max_listeners=max_listeners,
        page=page,
        limit=limit
    )
    db.add(log)
    db.commit()
    query = db.query(Artist)

    try:
        if zip and radius:
            try:
                lat, lon = get_lat_lon_from_zip(zip,"backend/data/uszips.csv")
            except ZipNotFoundError:
                return {"error": "Unknown ZIP code"}, 400
            query = query_artists_within_radius(lat, lon, radius, db)

        if genre:
            query = query.filter(Artist.genre == genre)

        if first_name:
            query = query.filter(Artist.first_name.ilike(f"%{first_name}%"))

        if last_name:
            query = query.filter(Artist.last_name.ilike(f"%{last_name}%"))
        
        if stage_name:
            query = query.filter(Artist.stage_name.ilike(f"%{stage_name}%"))

        if min_listeners is not None:
            query = query.filter(Artist.monthly_listeners >= min_listeners)

        if max_listeners is not None:
            query = query.filter(Artist.monthly_listeners <= max_listeners)

    except Exception as e:
        return error("Failed to fetch artists")

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
    query = [
        {
            "id" : artist.id,
            "name" : artist.name,
            "artist name" : artist.artist_name,
            "genre" : artist.genre,
            "zip" : artist.zip,
            "neighborhood" : artist.neighborhood,
            "monthly listeners" : artist.monthly_listeners,
            "distance" : distance
        }
        for artist,distance in artists
    ]
    artists = query.offset(skip).limit(limit).all()
    total = query.count()

    return {
        "total" : total,
        "page" : page,
        "limit" : limit,
        "artists" : artists
    }