from backend.db.database import SessionLocal
from backend.models.artist import Artist

artists = [
    Artist(first_name="Lana", last_name="Del Rey", zip_code="11215", genre="Indie", monthly_listeners=30000000),
    Artist(first_name="Jack", last_name="Antonoff", zip_code="11217", genre="Indie Pop", monthly_listeners=5000000),
    Artist(first_name="Phoebe", last_name="Bridgers", zip_code="90026", genre="Indie Folk", monthly_listeners=8000000)
]

db = SessionLocal()

for a in artists:
    db.add(a)

db.commit()
db.close()

print("Seeded sample artists.")