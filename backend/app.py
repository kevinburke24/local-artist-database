from slowapi.errors import RateLimitExceeded
from fastapi import FastAPI, Depends
from sqlalchemy import __version__
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from backend.db.database import engine, Base
from backend.models.search_log import SearchLog
from backend.models.artist import Artist
from backend.routes.artist_routes import router as artist_router
from backend.routes.artist_routes import limiter, get_db
import logging

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://local-artist-database.vercel.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # for dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app = FastAPI()
app.state.limiter=limiter
app.add_exception_handler(RateLimitExceeded, ...)

Base.metadata.create_all(bind=engine)

app.include_router(artist_router)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.on_event("startup")
def startup_event():
    logger.info("Backend starting up...")

@app.get("/health")
def health():
    logger.info("Health check called")
    return {"status": "ok"}

@app.get("/stats")
def stats(db: Session = Depends(get_db)):
    count = db.query(Artist).count()
    searches = db.query(SearchLog).count()
    return {
        "artists" : count,
        "searches" : searches,
        "db_version" : __version__
    }