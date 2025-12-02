import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchArtist } from "./api";
import SkeletonCard from "./components/SkeletonCard";

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
  const navigate = useNavigate();
  const [ artist, setArtist ] = useState<Artist | null>(null);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState("");

  useEffect(() => {
    loadArtist();
  }, [id]);

  async function loadArtist() {
      setLoading(true);

      try {
        const data = await fetchArtist(id);
        setArtist(data);
        //const res = await fetch(`http://localhost:8000/artists/${id}`);
        //const data = await res.json();
      setArtist(data);
      } catch {
        setError(`Artist not found ${typeof id}`);
      }
      setLoading(false);
  }

  if (loading) return <SkeletonCard/>;
  if (error) return <div> {error} </div>;
  if (!artist) return <div>No artist found.</div>;

  return (
    <div style={{ padding: 20 }}>
      <button
      onClick={() => navigate(-1)}
      style={{
        marginBottom: "20px",
        padding: "8px 12px",
        borderRadius: "6px",
        background: "#f2f2f2",
        border: "1px solid #ccc",
        cursor: "pointer"
      }}  
    >
      ← Back to results
    </button>
      <h2>{artist.first_name} {artist.last_name}</h2>
      <p><strong>Genre:</strong> {artist.genre}</p>
      <p><strong>Zip Code:</strong> {artist.zip_code}</p>
      <p><strong>Monthly Listeners:</strong> {artist.monthly_listeners ?? "N/A"}</p>
    </div>
  );
}

export default ArtistDetail;