from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.db.database import engine, Base
from backend.models import artist
from backend.routes.artist_routes import router as artist_router
import logging

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://local-artist-database.com"
]

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(artist_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.on_event("startup")
def startup_event():
    logger.info("Backend starting up...")

@app.get("/health")
def health():
    logger.info("Health check called")
    return {"status": "ok"}