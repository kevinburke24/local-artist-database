import { Link } from "react-router-dom";
import spotifyLogo from "../assets/images/spotify.svg";

interface Artist {
  id: number;
  first_name: string;
  last_name: string;
  stage_name: string;
  genre: string;
  zip_code: string;
  neighborhood: string;
  spotify_url: string;
  monthly_listeners: number | null;
  distance : string;
}

interface Props {
  artists: Artist[];
}

function LinkIcon({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
    >
      {children}
    </a>
  );
}

export default function ArtistTable({ artists }: Props,) {
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
          <th>Spotify</th>
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
            <td> {a.stage_name} </td>
            <td>{a.genre}</td>
            <td>{a.zip_code}</td>
            <td>{a.neighborhood}</td>
            <td>{a.distance}</td>
            <td>
                <LinkIcon href={a.spotify_url} label="Open Spotify">
                  <img src={spotifyLogo} alt="" width={16} height={16} />
                </LinkIcon>
            </td>
            <td>{a.monthly_listeners ?? "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}