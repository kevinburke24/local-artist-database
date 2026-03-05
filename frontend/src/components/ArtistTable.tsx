import { Link } from "react-router-dom";
import spotifyLogo from "../assets/images/spotify.svg";
import youtubeLogo from "../assets/images/youtube-icon.svg";
import instagramLogo from "../assets/images/instagram.svg";
import soundcloudLogo from "../assets/images/soundcloud.svg";

interface Artist {
  id: number;
  first_name: string;
  last_name: string;
  stage_name: string;
  genre: string;
  zip_code: string;
  neighborhood: string;
  spotify_url: string;
  youtube_url: string;
  instagram_url: string;
  soundcloud_url: string;
  monthly_listeners: number | null;
  distance: string;
}

interface Props {
  artists: Artist[];
}

function LinkIcon({ href, label, src }: { href?: string; label: string; src: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="link-icon"
    >
      <img src={src} alt={label} width={18} height={18} />
    </a>
  );
}

function formatListeners(n: number | null) {
  if (n === null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default function ArtistTable({ artists }: Props) {
  return (
    <div className="artist-table-wrap">
      <table className="artist-table">
        <thead>
          <tr>
            <th>Artist</th>
            <th>Stage Name</th>
            <th>Genre</th>
            <th>Location</th>
            <th>Distance</th>
            <th>Links</th>
            <th>Listeners</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((a) => (
            <tr key={a.id}>
              <td>
                <Link to={`/artists/${a.id}`} className="artist-name-link">
                  {a.first_name} {a.last_name}
                </Link>
              </td>
              <td className="stage-name">{a.stage_name || "—"}</td>
              <td>
                {a.genre ? <span className="genre-badge">{a.genre}</span> : "—"}
              </td>
              <td>
                <div>{a.neighborhood || a.zip_code}</div>
                {a.neighborhood && (
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{a.zip_code}</div>
                )}
              </td>
              <td className="distance-text">{a.distance} mi</td>
              <td>
                <div className="links-cell">
                  <LinkIcon href={a.spotify_url} label="Spotify" src={spotifyLogo} />
                  <LinkIcon href={a.youtube_url} label="YouTube" src={youtubeLogo} />
                  <LinkIcon href={a.instagram_url} label="Instagram" src={instagramLogo} />
                  <LinkIcon href={a.soundcloud_url} label="SoundCloud" src={soundcloudLogo} />
                </div>
              </td>
              <td className="listeners-num">{formatListeners(a.monthly_listeners)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
