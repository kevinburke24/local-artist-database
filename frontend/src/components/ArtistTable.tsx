import { Link } from "react-router-dom";

interface Artist {
  id: number;
  first_name: string;
  last_name: string;
  genre: string;
  zip_code: string;
  monthly_listeners: number | null;
}

interface Props {
  artists: Artist[];
}

export default function ArtistTable({ artists }: Props) {
  return (
    <table border={1} cellPadding={8} style={{ marginTop: "20px", width: "100%" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Genre</th>
          <th>Zip</th>
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
            <td>{a.genre}</td>
            <td>{a.zip_code}</td>
            <td>{a.monthly_listeners ?? "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}