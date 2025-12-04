const API_URL = import.meta.env.VITE_API_URL;

export async function fetchArtists(params: any) {
    const query = new URLSearchParams();
    if (params.name) query.append("first_name", params.name);
    if (params.genre) query.append("genre", params.genre);
    if (params.zip) query.append("zip_code", params.zip);
    if (params.min_listeners) query.append("min_listeners", String(params.min_listeners));
    if (params.max_listeners) query.append("max_listeners", String(params.max_listeners));
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);

    const res = await fetch(`${API_URL}/artists?${query.toString()}`);
    if(!res.ok) throw new Error("Failed to fetch artists");

    return res.json();
}

export async function fetchArtist(id : string | undefined) {
    const res = await fetch(`${API_URL}/artists/${id}`);
    if(!res.ok) throw new Error("Failed to fetch artist");
    return res.json();
}