const API_URL = "http://localhost:8000";

export async function fetchArtists(params: {
    name?: string;
    genre?: string;
    zip?: string;
    min_listeners?: number;
    max_listeners?: number;
}) {
    const query = new URLSearchParams();

    if (params.name) query.append("first_name", params.name);
    if (params.genre) query.append("genre", params.genre);
    if (params.zip) query.append("zip_code", params.zip);
    if (params.min_listeners) query.append("min_listeners", String(params.min_listeners));
    if (params.max_listeners) query.append("max_listeners", String(params.max_listeners));

    const res = await fetch(`http://localhost:8000/artists?${query.toString()}`);

    if(!res.ok) throw new Error("Failed to fetch artists");

    return res.json();
}