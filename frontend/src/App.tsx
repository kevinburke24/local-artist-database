import { useEffect, useState } from "react";
import { fetchArtists } from "./api";
import { Routes, Route } from "react-router-dom";
import ArtistDetail from "./ArtistDetail";
import ArtistTable from "./components/ArtistTable";
import ArtistFilters from "./components/ArtistFilters";
import PageLayout from "./components/PageLayout"

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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
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
        max_listeners: maxListeners ? Number(maxListeners) : undefined,
        page,
        limit,
      });
      setArtists(data.artists);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page]);

  if (loading) return <div>Loading artists...</div>;

  return (
    <Routes>
      <Route
        path = "/"
        element={
          <div style={{ padding: "20px" }}>
          <h1>Local Artist Database</h1>
          <PageLayout>
          <ArtistFilters
            name={name} setName={setName}
            genre={genre} setGenre={setGenre}
            zip={zip} setZip={setZip}
            minListeners={minListeners} setMinListeners={setMinListeners}
            maxListeners={maxListeners} setMaxListeners={setMaxListeners}
            onSearch={load}
          />
          {/* TABLE */}
          {loading && <div>Loading...</div>}
          {!loading && <ArtistTable artists={artists} />}
          {!loading && artists.length === 0 && <div>No results found.</div>}
          {/* PAGINATION */}
          <div style={{ marginTop: 20 }}>
            <button 
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>

            <span style={{ margin: "0 10px" }}>
              Page {page} of {Math.ceil(total / limit)}
            </span>

            <button 
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
          </PageLayout>
          </div>
        }
      />
      <Route path="/artists/:id" element={<ArtistDetail />} />
    </Routes>
  );
}

export default App;