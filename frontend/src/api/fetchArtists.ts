const API_URL = import.meta.env.VITE_API_URL;

export async function fetchArtists(params: any) {
    const query = new URLSearchParams();
    if (params.name) query.append("first_name", params.name);
    if (params.stage_name) query.append("stage_name", params.stage_name)
    if (params.genre) query.append("genre", params.genre)
    if (params.neighborhood) query.append("neighborhood", params.neighborhood);
    if (params.instrument) query.append("instrument", params.instrument);
    if (params.filter_zip) query.append("filter_zip", params.filter_zip);
    if (params.origin_zip) query.append("origin_zip", params.origin_zip)
    if (params.radius) query.append("radius", params.radius);
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    try {
        const res = await fetch(`${API_URL}/artists?${query.toString()}`);
        const body = await res.json();
        if (!res.ok) throw new Error(body.detail || "Failed to fetch artists");
        return body;
    } catch (err) {
        if (err instanceof Error) throw err;
        throw new Error("Could not connect to the server. Please try again.");
    }
}

/*export async function fetchArtist(id : string | undefined) {
    const res = await fetch(`${API_URL}/artists/${id}`);
    if(!res.ok) throw new Error("Failed to fetch artist");
    return res.json();
}*/