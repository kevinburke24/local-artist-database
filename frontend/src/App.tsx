import { useEffect, useState } from "react";
import { fetchArtists } from "./api";
import { Routes, Route, Link } from "react-router-dom";
import ArtistDetail from "./ArtistDetail";

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
  const [loading, setLoading] = useState(false);

  // filter state
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [zip, setZip] = useState("");
  const [minListeners, setMinListeners] = useState("");
  const [maxListeners, setMaxListeners] = useState("");

  async function load() {
    try {
      const data = await fetchArtists({
        name,
        genre,
        zip,
        min_listeners: minListeners ? Number(minListeners) : undefined,
        max_listeners: maxListeners ? Number(maxListeners) : undefined
      });
      setArtists(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div>Loading artists...</div>;

  return (
    <Routes>
      <Route
        path = "/"
        element={
          <div style={{ padding: "20px" }}>
          <h1>Local Artist Database</h1>
        {/* FILTER UI */}
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
          <input
            placeholder="Zip"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
          <input
            placeholder="Min Listeners"
            value={minListeners}
            onChange={(e) => setMinListeners(e.target.value)}
          />
          <input
            placeholder="Max Listeners"
            value={maxListeners}
            onChange={(e) => setMaxListeners(e.target.value)}
          />

          <button onClick={load}>Search</button>
        </div>
          {/* TABLE */}
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
        {artists.length === 0 && !loading && <div>No results found.</div>}
          </div>
        }
      />
      <Route path="/artists/:id" element={<ArtistDetail />} />
    </Routes>
  );
}

export default App;
