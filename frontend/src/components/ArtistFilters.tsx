interface Props {
  name: string;
  setName: (v: string) => void;
  genre: string;
  setGenre: (v: string) => void;
  zip: string;
  setZip: (v: string) => void;
  onSearch: () => void;
}

export default function ArtistFilters({
  name, setName,
  genre, setGenre,
  zip, setZip,
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
      <button className="btn btn-primary" onClick={onSearch}>Search</button>
    </div>
  );
}
