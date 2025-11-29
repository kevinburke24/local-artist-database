const API_URL = import.meta.env.VITE_API_URL;

export async function fetchArtists(params: any) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([k,v]) => {
        if (v !== undefined && v != "") {
            query.append(k, String(v));
        }
    });

    const res = await fetch(`${API_URL}/artists?${query.toString()}`);
    if(!res.ok) throw new Error("Failed to fetch artists");

    return res.json();
}