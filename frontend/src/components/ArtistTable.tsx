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
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      <img src={src} alt={label} width={20} height={20} />
    </a>
  );
}

export default function ArtistTable({ artists }: Props) {
  return (
    <table border={1} cellPadding={8} style={{ marginTop: "20px", width: "100%" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Stage Name</th>
          <th>Genre</th>
          <th>Zip</th>
          <th>Neighborhood</th>
          <th>Distance</th>
          <th>Links</th>
          <th>Listeners</th>
        </tr>
      </thead>
      <tbody>
        {artists.map((a) => (
          <tr key={a.id}>
            <td>
              <Link to={`/artists/${a.id}`}>
                {a.first_name} {a.last_name}
              </Link>
            </td>
            <td>{a.stage_name}</td>
            <td>{a.genre}</td>
            <td>{a.zip_code}</td>
            <td>{a.neighborhood}</td>
            <td>{a.distance}</td>
            <td>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <LinkIcon href={a.spotify_url} label="Spotify" src={spotifyLogo} />
                <LinkIcon href={a.youtube_url} label="YouTube" src={youtubeLogo} />
                <LinkIcon href={a.instagram_url} label="Instagram" src={instagramLogo} />
                <LinkIcon href={a.soundcloud_url} label="SoundCloud" src={soundcloudLogo} />
              </div>
            </td>
            <td>{a.monthly_listeners ?? "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
