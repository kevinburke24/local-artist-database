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
  onSearch
}: Props) {
  return (
    <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
      <input placeholder="Zip" value={zip} onChange={(e) => setZip(e.target.value)} />
      <input placeholder="Min" value={minListeners} onChange={(e) => setMinListeners(e.target.value)} />
      <input placeholder="Max" value={maxListeners} onChange={(e) => setMaxListeners(e.target.value)} />
      <button onClick={onSearch}>Search</button>
    </div>
  );
}
