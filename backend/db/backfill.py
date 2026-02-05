from backend.models.artist import Artist
from backend.db.database import SessionLocal
from pathlib import Path
import csv

BASE_DIR = Path(__file__).resolve().parents[1]
CSV_PATH = BASE_DIR / "data" / "backfill_ids.csv"

def main():
    db = SessionLocal()

    with open(CSV_PATH, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            artist_id = int(row["id"])
            artist = db.query(Artist).filter(Artist.id == artist_id).one_or_none()
            if not artist:
                continue
            if not artist.instagram_url and row.get("instagram_url"):
                artist.instagram_url = row.get("instagram_url").strip()
            if not artist.soundcloud_url and row.get("soundcloud_url"):
                artist.soundcloud_url = row.get("soundcloud_url")
        db.commit()
        print("Updated rows")
    db.close()

if __name__ == "__main__":
    main()