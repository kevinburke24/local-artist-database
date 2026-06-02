import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import SkeletonCard from "./components/SkeletonCard";

const API_URL = import.meta.env.VITE_API_URL;

interface Artist {
  id: number;
  first_name: string;
  last_name: string;
  stage_name: string;
  genre: string;
  city?: string;
  state?: string;
  zip_code: string;
  neighborhood?: string;
  spotify_url?: string;
  youtube_url?: string;
  instagram_url?: string;
  soundcloud_url?: string;
  bio?: string;
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

  const cityState = artist.city && artist.state
    ? `${artist.city}, ${artist.state}`
    : artist.city || artist.zip_code;

  const rows: [string, string | null | undefined][] = [
    ["Stage Name", artist.stage_name || null],
    ["City", cityState],
    ["Neighborhood", artist.neighborhood || null],
    ["ZIP Code", artist.zip_code],
    ["Genre", artist.genre],
  ];

  const links: [string, string | undefined][] = [
    ["Spotify", artist.spotify_url],
    ["YouTube", artist.youtube_url],
    ["Instagram", artist.instagram_url],
    ["SoundCloud", artist.soundcloud_url],
  ].filter(([, url]) => url) as [string, string][];

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
            {rows.filter(([, v]) => v).map(([label, value]) => (
              <tr key={label} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "10px 0", color: "var(--text-secondary)", fontSize: "0.88rem", width: 160 }}>{label}</td>
                <td style={{ padding: "10px 0", fontWeight: 500 }}>{value}</td>
              </tr>
            ))}
            {links.length > 0 && (
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "10px 0", color: "var(--text-secondary)", fontSize: "0.88rem", width: 160 }}>Links</td>
                <td style={{ padding: "10px 0" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    {links.map(([label, url]) => (
                      <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500 }}>{label}</a>
                    ))}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {artist.bio && (
          <p style={{ marginTop: 20, color: "var(--text-secondary)", fontSize: "0.93rem", lineHeight: 1.6 }}>
            {artist.bio}
          </p>
        )}

        <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
          <Link to={`/artists/${artist.id}/edit`} style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            Edit your listing
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ArtistDetail;
