import { useEffect, useState } from "react";
import { fetchArtists } from "./api";
import { Routes, Route } from "react-router-dom";
import ArtistDetail from "./ArtistDetail";
import ArtistTable from "./components/ArtistTable";
import ArtistFilters from "./components/ArtistFilters";
import PageLayout from "./components/PageLayout"
import SkeletonTable from "./components/SkeletonTable";
import spotifyLogo from "./assets/images/spotify.svg";

interface Artist {
  id: number;
  first_name: string;
  last_name: string;
  stage_name: string;
  genre: string;
  zip_code: string;
  neighborhood: string;
  monthly_listeners: number | null;
  spotify_url: string;
  distance : string;
}

function App() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const [zipInput, setZipInput] = useState("");
  const [radius, setRadius] = useState<number>(5);
  const [search, setSearch] = useState<{ zip: string; radius: number } | null>(null);

  // filter state
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState("");
  //const [stage_name, setStageName] = useState("");
  const [genre, setGenre] = useState("");
  const [filter_zip, setZip] = useState("");
  //const [neighborhood, setNeighborhood] = useState("");
  const [minListeners, setMinListeners] = useState("");
  const [maxListeners, setMaxListeners] = useState("");

  async function load() {
    if (!search) {
      setGenre("");
      setZip("");
      setMinListeners("");
      setMaxListeners("");
      setName("");
      return;
    }
    setError("");
    setLoading(true)
    try {
      const data = await fetchArtists({
        origin_zip : search.zip,
        radius : search.radius,
        filter_zip,
        name,
        genre,
        min_listeners: minListeners ? Number(minListeners) : undefined,
        max_listeners: maxListeners ? Number(maxListeners) : undefined,
        page,
        limit
      });
      setArtists(data.artists);
      setTotal(data.total);
    } catch (err : any) {
      setError(`Artist(s) not found.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("API URL:", import.meta.env.VITE_API_URL);
    load();
  }, [search, page]);

  if (!search && loading) return <div>Loading page... </div>
  else if (loading) return <div>Loading artists...</div>;
  
  if (!search) {
    return (
      <div style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
        <h2>Find artists near you</h2>

        <label style={{ display: "block", marginTop: 12 }}>
          ZIP code
          <input
            value={zipInput}
            onChange={(e) => setZipInput(e.target.value)}
            placeholder="e.g., 11215"
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label style={{ display: "block", marginTop: 12 }}>
          Radius
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          >
            <option value={1}>1 mile</option>
            <option value={5}>5 miles</option>
            <option value={10}>10 miles</option>
            <option value={25}>25 miles</option>
            <option value={50}>50 miles</option>
          </select>
        </label>

        <button
          style={{ marginTop: 16, padding: "10px 14px" }}
          onClick={() => {
            // optional: quick client-side validation
            const z = zipInput.trim();
            if (!/^\d{5}$/.test(z)) return alert("Please enter a 5-digit ZIP code.");
            setSearch({ zip: z, radius });
          }}
        >
          Search
        </button>
      </div>
    );
  }
  return (
    <Routes>
      <Route
        path = "/"
        element={
          <div style={{ padding: "20px" }}>
          <h1>Local Artist Database</h1>
          <PageLayout>
            <div style={{ marginBottom: "15px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
              <h2 style={{ margin: 0 }}>
                Displaying artists within {search.radius} miles of {search.zip}
             </h2>

            <button
              onClick={() => {
                setSearch(null);   // go back to ZIP/radius screen
                setArtists([]);
                setPage(1);
              }}
            >
              Change search
            </button>
        </div>
          <ArtistFilters
            name={name} setName={setName}
            genre={genre} setGenre={setGenre}
            zip={filter_zip} setZip={setZip}
            minListeners={minListeners} setMinListeners={setMinListeners}
            maxListeners={maxListeners} setMaxListeners={setMaxListeners}
            onSearch={load}
          />
          {/* TABLE */}
          {loading && <SkeletonTable/>}
          {error && <div style={{ color : "red" }}>{error}</div>}
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