from fastapi import FastAPI
from backend.db.database import engine, Base
from backend.models import artist

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"status": "ok"}