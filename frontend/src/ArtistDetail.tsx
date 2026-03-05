import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SkeletonCard from "./components/SkeletonCard";

const API_URL = import.meta.env.VITE_API_URL;

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
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { loadArtist(); }, [id]);

  async function loadArtist() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/artists/${id}`);
      const data = await res.json();
      setArtist(data);
    } catch {
      setError("Artist not found.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <SkeletonCard />;
  if (error) return <div className="state-message">{error}</div>;
  if (!artist) return <div className="state-message">No artist found.</div>;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px" }}>
      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
        ← Back to results
      </button>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 32,
        boxShadow: "var(--shadow-md)"
      }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 4 }}>
          {artist.first_name} {artist.last_name}
        </h1>
        {artist.genre && <span className="genre-badge" style={{ marginBottom: 24, display: "inline-block" }}>{artist.genre}</span>}
        <table style={{ marginTop: 24, borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            {[
              ["ZIP Code", artist.zip_code],
              ["Monthly Listeners", artist.monthly_listeners?.toLocaleString() ?? "—"],
            ].map(([label, value]) => (
              <tr key={label} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "10px 0", color: "var(--text-secondary)", fontSize: "0.88rem", width: 160 }}>{label}</td>
                <td style={{ padding: "10px 0", fontWeight: 500 }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ArtistDetail;
