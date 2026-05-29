import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const inputStyle: React.CSSProperties = {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box",
};
const fieldStyle: React.CSSProperties = { display: "grid", gap: 6 };

interface ArtistData {
    id: number;
    first_name: string;
    last_name: string;
    stage_name: string;
    genre: string;
    city?: string;
    state?: string;
    zip_code: string;
    neighborhood?: string;
    spotify_url?: string;
    youtube_url?: string;
    instagram_url?: string;
    soundcloud_url?: string;
    bio?: string;
}

export default function EditArtist() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [artist, setArtist] = useState<ArtistData | null>(null);
    const [loadError, setLoadError] = useState("");

    // Email request phase
    const [email, setEmail] = useState("");
    const [requestSent, setRequestSent] = useState(false);
    const [requestError, setRequestError] = useState("");
    const [requesting, setRequesting] = useState(false);

    // Edit form phase
    const [stageName, setStageName] = useState("");
    const [genre, setGenre] = useState("");
    const [city, setCity] = useState("");
    const [stateAbbr, setStateAbbr] = useState("");
    const [zip, setZip] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [spotifyUrl, setSpotifyUrl] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [instagramUrl, setInstagramUrl] = useState("");
    const [soundcloudUrl, setSoundcloudUrl] = useState("");
    const [bio, setBio] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function loadArtist() {
            try {
                const res = await fetch(`${API_URL}/artists/${id}`);
                if (!res.ok) { setLoadError("Artist not found."); return; }
                const data: ArtistData = await res.json();
                setArtist(data);
                if (token) {
                    setStageName(data.stage_name ?? "");
                    setGenre(data.genre ?? "");
                    setCity(data.city ?? "");
                    setStateAbbr(data.state ?? "");
                    setZip(data.zip_code ?? "");
                    setNeighborhood(data.neighborhood ?? "");
                    setSpotifyUrl(data.spotify_url ?? "");
                    setYoutubeUrl(data.youtube_url ?? "");
                    setInstagramUrl(data.instagram_url ?? "");
                    setSoundcloudUrl(data.soundcloud_url ?? "");
                    setBio(data.bio ?? "");
                }
            } catch {
                setLoadError("Could not load artist.");
            }
        }
        loadArtist();
    }, [id, token]);

    async function handleRequestLink(e: React.FormEvent) {
        e.preventDefault();
        setRequestError("");
        setRequesting(true);
        try {
            const res = await fetch(`${API_URL}/artists/${id}/request-edit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });
            if (!res.ok) { setRequestError("Something went wrong. Please try again."); return; }
            setRequestSent(true);
        } catch {
            setRequestError("Something went wrong. Please try again.");
        } finally {
            setRequesting(false);
        }
    }

    async function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitError("");
        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/artists/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    stage_name: stageName.trim() || null,
                    genre: genre.trim() || null,
                    city: city.trim() || null,
                    state: stateAbbr.trim().toUpperCase() || null,
                    zip_code: zip.trim() || null,
                    neighborhood: neighborhood.trim() || null,
                    spotify_url: spotifyUrl.trim() || null,
                    youtube_url: youtubeUrl.trim() || null,
                    instagram_url: instagramUrl.trim() || null,
                    soundcloud_url: soundcloudUrl.trim() || null,
                    bio: bio.trim() || null,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                setSubmitError(data.detail ?? "Update failed. The link may have expired.");
                return;
            }
            setSuccess(true);
        } catch {
            setSubmitError("Update failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loadError) return <div className="state-message">{loadError}</div>;
    if (!artist) return <div className="state-message">Loading…</div>;

    return (
        <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 16px" }}>
            <button
                onClick={() => navigate(`/artists/${id}`)}
                style={{ marginBottom: 20, padding: "8px 12px", borderRadius: 6, background: "#f2f2f2", border: "1px solid #ccc", cursor: "pointer" }}
            >
                ← Back
            </button>

            <h1 style={{ marginBottom: 4 }}>Edit listing</h1>
            <p style={{ marginTop: 0, color: "#555" }}>
                {artist.first_name} {artist.last_name}
            </p>

            {!token ? (
                requestSent ? (
                    <div style={{ padding: 16, border: "1px solid #2a9d5c", borderRadius: 8, background: "#f0faf5" }}>
                        If that email matches our records, you'll receive an edit link shortly. Check your inbox.
                    </div>
                ) : (
                    <form onSubmit={handleRequestLink} style={{ display: "grid", gap: 14 }}>
                        <p style={{ margin: 0, color: "#555", fontSize: 14 }}>
                            Enter the email address you used when submitting your listing. We'll send you a link to edit it.
                        </p>
                        {requestError && (
                            <div style={{ padding: 12, border: "1px solid #c0392b", borderRadius: 8, background: "#fdf3f2", color: "#c0392b" }}>
                                {requestError}
                            </div>
                        )}
                        <div style={fieldStyle}>
                            <label>Email</label>
                            <input
                                style={inputStyle}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={requesting}
                            style={{ padding: "10px 14px", borderRadius: 6, border: "none", background: "#2a9d5c", color: "#fff", fontSize: 15, cursor: "pointer" }}
                        >
                            {requesting ? "Sending…" : "Send edit link"}
                        </button>
                    </form>
                )
            ) : success ? (
                <div style={{ padding: 16, border: "1px solid #2a9d5c", borderRadius: 8, background: "#f0faf5" }}>
                    Your listing has been updated!{" "}
                    <a href={`/artists/${id}`}>View it here.</a>
                </div>
            ) : (
                <form onSubmit={handleEditSubmit} style={{ display: "grid", gap: 14 }}>
                    {submitError && (
                        <div style={{ padding: 12, border: "1px solid #c0392b", borderRadius: 8, background: "#fdf3f2", color: "#c0392b" }}>
                            {submitError}
                        </div>
                    )}

                    <div style={fieldStyle}>
                        <label>Stage name</label>
                        <input style={inputStyle} value={stageName} onChange={(e) => setStageName(e.target.value)} />
                    </div>

                    <div style={fieldStyle}>
                        <label>Genre</label>
                        <input style={inputStyle} value={genre} onChange={(e) => setGenre(e.target.value)} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
                        <div style={fieldStyle}>
                            <label>City</label>
                            <input style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                        <div style={fieldStyle}>
                            <label>State</label>
                            <input style={inputStyle} value={stateAbbr} onChange={(e) => setStateAbbr(e.target.value)} maxLength={2} placeholder="MA" />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div style={fieldStyle}>
                            <label>ZIP code</label>
                            <input style={inputStyle} value={zip} onChange={(e) => setZip(e.target.value)} maxLength={5} />
                        </div>
                        <div style={fieldStyle}>
                            <label>Neighborhood</label>
                            <input style={inputStyle} value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
                        </div>
                    </div>

                    <hr style={{ opacity: 0.2, margin: "4px 0" }} />

                    <div style={fieldStyle}>
                        <label>Spotify</label>
                        <input style={inputStyle} value={spotifyUrl} onChange={(e) => setSpotifyUrl(e.target.value)} placeholder="https://open.spotify.com/artist/..." />
                    </div>
                    <div style={fieldStyle}>
                        <label>YouTube</label>
                        <input style={inputStyle} value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/..." />
                    </div>
                    <div style={fieldStyle}>
                        <label>Instagram</label>
                        <input style={inputStyle} value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/..." />
                    </div>
                    <div style={fieldStyle}>
                        <label>SoundCloud</label>
                        <input style={inputStyle} value={soundcloudUrl} onChange={(e) => setSoundcloudUrl(e.target.value)} placeholder="https://soundcloud.com/..." />
                    </div>

                    <div style={fieldStyle}>
                        <label>Bio</label>
                        <textarea style={{ ...inputStyle, resize: "vertical" }} value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        style={{ padding: "10px 14px", borderRadius: 6, border: "none", background: "#2a9d5c", color: "#fff", fontSize: 15, cursor: submitting ? "not-allowed" : "pointer" }}
                    >
                        {submitting ? "Saving…" : "Save changes"}
                    </button>
                </form>
            )}
        </div>
    );
}
