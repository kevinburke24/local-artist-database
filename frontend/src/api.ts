const API_URL = import.meta.env.VITE_API_URL;

export async function fetchArtists(params: any) {
    const query = new URLSearchParams();
    if (params.name) query.append("first_name", params.name);
    if (params.stage_name) query.append("stage_name", params.stage_name)
    if (params.genre) query.append("genre", params.genre)
    if (params.filter_zip) query.append("filter_zip", params.filter_zip);
    if (params.origin_zip) query.append("origin_zip", params.origin_zip)
    if (params.radius) query.append("radius", params.radius);
    if (params.min_listeners) query.append("min_listeners", String(params.min_listeners));
    if (params.max_listeners) query.append("max_listeners", String(params.max_listeners));
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    try {
        const res = await fetch(`${API_URL}/artists?${query.toString()}`);
        return res.json();
    } catch {
        throw new Error(`${API_URL}/artists?${query.toString()}`);
    }
}

export async function fetchArtist(id : string | undefined) {
    const res = await fetch(`${API_URL}/artists/${id}`);
    if(!res.ok) throw new Error("Failed to fetch artist");
    return res.json();
}