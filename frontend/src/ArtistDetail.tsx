import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Artist {
  id: number;
  first_name: string;
  last_name: string;
  genre: string;
  zip_code: string;
  monthly_listeners: number | null;
}

function ArtistDetail() {
  const { id } = useParams();
  const [artist, setArtist] = useState<Artist | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`http://localhost:8000/artists/${id}`);
      const data = await res.json();
      setArtist(data);
    }
    load();
  }, [id]);

  if (!artist) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{artist.first_name} {artist.last_name}</h2>
      <p><strong>Genre:</strong> {artist.genre}</p>
      <p><strong>Zip Code:</strong> {artist.zip_code}</p>
      <p><strong>Monthly Listeners:</strong> {artist.monthly_listeners ?? "N/A"}</p>
    </div>
  );
}

export default ArtistDetail;