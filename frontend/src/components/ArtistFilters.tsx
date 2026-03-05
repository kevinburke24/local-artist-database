interface Props {
  name: string;
  setName: (v: string) => void;
  genre: string;
  setGenre: (v: string) => void;
  zip: string;
  setZip: (v: string) => void;
  minListeners: string;
  setMinListeners: (v: string) => void;
  maxListeners: string;
  setMaxListeners: (v: string) => void;
  onSearch: () => void;
}

export default function ArtistFilters({
  name, setName,
  genre, setGenre,
  zip, setZip,
  minListeners, setMinListeners,
  maxListeners, setMaxListeners,
  onSearch,
}: Props) {
  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") onSearch();
  }

  return (
    <div className="filters">
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKey} />
      <input placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} onKeyDown={handleKey} />
      <input placeholder="ZIP" value={zip} onChange={(e) => setZip(e.target.value)} onKeyDown={handleKey} style={{ maxWidth: 90 }} />
      <input placeholder="Min listeners" value={minListeners} onChange={(e) => setMinListeners(e.target.value)} onKeyDown={handleKey} style={{ maxWidth: 120 }} />
      <input placeholder="Max listeners" value={maxListeners} onChange={(e) => setMaxListeners(e.target.value)} onKeyDown={handleKey} style={{ maxWidth: 120 }} />
      <button className="btn btn-primary" onClick={onSearch}>Search</button>
    </div>
  );
}
