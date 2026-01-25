from backend.db.database import SessionLocal, create_schema, inspector
from backend.models.artist import Artist

if not inspector.has_table("artists"):
    create_schema()

artists = [
    Artist(first_name="Melanie", last_name="Star", stage_name="Mel Star", zip_code="02215", latitude=42.34223, longitude=-71.08749, neighborhood="N/A", genre="Folk", monthly_listeners=0, spotify_url="", youtube_url="", bio=""),
    Artist(first_name="Thomas", last_name="Baxley", stage_name="Trace Baxley", zip_code="02134", latitude=42.35765, longitude=-71.12889, neighborhood="Allston", genre="Indie Pop", monthly_listeners=0, spotify_url="", youtube_url="", bio=""),
    Artist(first_name="Nick", last_name="Prato", stage_name="Nick Prato", zip_code="02145", latitude=42.39135, longitude=-71.09267, neighborhood="Somerville", genre="Indie Rock", monthly_listeners=0, spotify_url="", youtube_url="", bio=""),
    Artist(first_name="Jared", last_name="Hahn", stage_name="Jared Hahn", zip_code="02145",  latitude=42.39144, longitude=-71.09269, neighborhood="Somerville", genre="Rock", monthly_listeners=0, spotify_url="", youtube_url="", bio=""),
    Artist(first_name="Andrew", last_name="Choi", stage_name="Iasu", zip_code="02140", latitude=42.39325, longitude=-71.13454, neighborhood="Alewife", genre="Neo-Soul", monthly_listeners=0, spotify_url="", youtube_url="", bio=""),
    Artist(first_name="Cooper", last_name="Smithson", stage_name="Cooper Smithson", zip_code="02139",latitude=42.3647, longitude=-71.1025, neighborhood="Cambridgeport", genre="Folk", monthly_listeners=0, spotify_url="", youtube_url="", bio="")
]

db = SessionLocal()

for a in artists:
    db.add(a)

db.commit()
db.close()

print("Seeded sample artists.")