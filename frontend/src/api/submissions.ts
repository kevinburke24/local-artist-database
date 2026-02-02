const API_URL = import.meta.env.VITE_API_URL;

export type ArtistSubmissionsCreate = {
    first_name: string;
    last_name: string;
    stage_name: string;
    email:string;
    zip_code: string;
    neighborhood?: string | null;
    genre?: string | null;
    spotify_url?: string | null;
    youtube_url?: string | null;
    bio?: string | null;
    
    // honeypot
    company?: string | null;
};

export async function submitArtist(payload: ArtistSubmissionsCreate) {
    const res = await fetch(`${API_URL}/artists/artist-submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        let detail = `Request failed (${res.status})`;
        try {
            const data = await res.json();
            detail = data?.detail ?? detail;
        } catch {
            // ignore
        }
        throw new Error(detail);
    }
    return res.json();
}