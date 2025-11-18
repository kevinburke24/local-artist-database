from fastapi import FastAPI
from backend.db.database import engine, Base
from backend.models import artist
from backend.routes.artist_routes import router as artist_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(artist_router)

@app.get("/health")
def health():
    return {"status": "ok"}