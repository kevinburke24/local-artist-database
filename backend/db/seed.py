from backend.db.database import SessionLocal, create_schema, inspector
from backend.models.artist import Artist

if not inspector.has_table("artists"):
    create_schema()

artists = [
    Artist(first_name="Elizabeth", last_name="Grant", stage_name="Lana Del Rey", zip_code="75460", neighborhood="N/A", genre="Pop", monthly_listeners=30000000),
    Artist(first_name="Jack", last_name="Antonoff", stage_name="Jack Antonoff", zip_code="90210", neighborhood="Beverly Hills", genre="Indie Pop", monthly_listeners=5000000),
    Artist(first_name="Phoebe", last_name="Bridgers", stage_name="Phoebe Bridgers", zip_code="90026", neighborhood="Silver Lake", genre="Indie Folk", monthly_listeners=8000000),
    Artist(first_name="Thom", last_name="Yorke", stage_name="Thom Yorke", zip_code="EC2M", neighborhood="Oxford", genre="Rock", monthly_listeners=20000000),
    Artist(first_name="Taylor", last_name="Swift", stage_name="Taylor Swift", zip_code="32054", neighborhood="East Nashville", genre="Pop", monthly_listeners=100000000),
    Artist(first_name="Morgan", last_name="Wallen", stage_name="Morgan Wallen", zip_code="49392", neighborhood="The Gulch", genre="Country", monthly_listeners=50000000)
]

db = SessionLocal()

for a in artists:
    db.add(a)

db.commit()
db.close()

print("Seeded sample artists.")