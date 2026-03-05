import { useEffect, useState } from "react";
import { fetchArtists } from "./api/fetchArtists";
import { Routes, Route } from "react-router-dom";
import ArtistDetail from "./ArtistDetail";
import ArtistTable from "./components/ArtistTable";
import ArtistFilters from "./components/ArtistFilters";
import SkeletonTable from "./components/SkeletonTable";
import AddYourself from "./components/AddYourself";

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
  youtube_url: string;
  instagram_url: string;
  soundcloud_url: string;
  distance: string;
}

function LandingPage({ onSearch }: { onSearch: (zip: string, radius: number) => void }) {
  const [zipInput, setZipInput] = useState("");
  const [radius, setRadius] = useState(5);

  function handleSearch() {
    const z = zipInput.trim();
    if (!/^\d{5}$/.test(z)) {
      alert("Please enter a 5-digit ZIP code.");
      return;
    }
    onSearch(z, radius);
  }

  return (
    <div className="landing-wrapper">
      <div className="landing-card">
        <h1>Local Artist Database</h1>
        <p className="subtitle">Discover independent musicians near you.</p>

        <div className="landing-fields">
          <div className="field">
            <label htmlFor="zip">ZIP Code</label>
            <input
              id="zip"
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              placeholder="e.g. 02139"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <div className="field">
            <label htmlFor="radius">Radius</label>
            <select
              id="radius"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            >
              <option value={1}>1 mile</option>
              <option value={5}>5 miles</option>
              <option value={10}>10 miles</option>
              <option value={25}>25 miles</option>
              <option value={50}>50 miles</option>
            </select>
          </div>

          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleSearch}>
            Search
          </button>
        </div>

        <p className="landing-footer">
          Are you an artist? <a href="/add-yourself">Add yourself</a>
        </p>
      </div>
    </div>
  );
}

function ResultsPage({
  search,
  onBack,
}: {
  search: { zip: string; radius: number };
  onBack: () => void;
}) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [filter_zip, setZip] = useState("");
  const [minListeners, setMinListeners] = useState("");
  const [maxListeners, setMaxListeners] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await fetchArtists({
        origin_zip: search.zip,
        radius: search.radius,
        filter_zip,
        name,
        genre,
        min_listeners: minListeners ? Number(minListeners) : undefined,
        max_listeners: maxListeners ? Number(maxListeners) : undefined,
        page,
        limit,
      });
      setArtists(data.artists);
      setTotal(data.total);
    } catch {
      setError("Could not load artists. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [search, page]);

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="results-wrapper">
      <div className="results-header">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Change Search
        </button>
        <h1>Local Artist Database</h1>
        <span className="results-subtitle">
          Within {search.radius} mi of {search.zip}
        </span>
      </div>

      <ArtistFilters
        name={name} setName={setName}
        genre={genre} setGenre={setGenre}
        zip={filter_zip} setZip={setZip}
        minListeners={minListeners} setMinListeners={setMinListeners}
        maxListeners={maxListeners} setMaxListeners={setMaxListeners}
        onSearch={() => { setPage(1); load(); }}
      />

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <SkeletonTable />
      ) : artists.length === 0 ? (
        <div className="state-message">No artists found in this area.</div>
      ) : (
        <ArtistTable artists={artists} />
      )}

      {!loading && artists.length > 0 && (
        <div className="pagination">
          <button className="btn btn-ghost" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button className="btn btn-ghost" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}

      <p style={{ marginTop: 24, fontSize: "0.88rem", color: "var(--text-secondary)", textAlign: "center" }}>
        Are you an artist? <a href="/add-yourself">Add yourself</a>
      </p>
    </div>
  );
}

function App() {
  const [search, setSearch] = useState<{ zip: string; radius: number } | null>(null);

  return (
    <Routes>
      <Route
        path="/"
        element={
          search ? (
            <ResultsPage search={search} onBack={() => setSearch(null)} />
          ) : (
            <LandingPage onSearch={(zip, radius) => setSearch({ zip, radius })} />
          )
        }
      />
      <Route path="/artists/:id" element={<ArtistDetail />} />
      <Route path="/add-yourself" element={<AddYourself />} />
    </Routes>
  );
}

export default App;
