import { useEffect, useState } from "react";
import { fetchArtists } from "./api";

interface Artist {
  id: number;
  first_name: string;
  last_name: string;
  genre: string;
  zip_code: string;
  monthly_listeners: number | null;
}

function App() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchArtists();
        setArtists(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Loading artists...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Local Artist Database</h1>
      
      <table border={1} cellPadding={8} style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Genre</th>
            <th>Zip</th>
            <th>Listeners</th>
          </tr>
        </thead>
        <tbody>
          {artists.map(a => (
            <tr key={a.id}>
              <td>{a.first_name} {a.last_name}</td>
              <td>{a.genre}</td>
              <td>{a.zip_code}</td>
              <td>{a.monthly_listeners ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
