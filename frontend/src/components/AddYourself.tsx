import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitArtist } from "../api/submissions";

function isFiveDigitZip(zip: string) {
    return /^\d{5}$/.test(zip.trim());
}

const fieldStyle: React.CSSProperties = { display: "grid", gap: 6 };
const inputStyle: React.CSSProperties = {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box",
};

export default function AddYourself() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [stageName, setStageName] = useState("");
    const [email, setEmail] = useState("");
    const [zip, setZip] = useState("");
    const [genre, setGenre] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [spotifyUrl, setSpotifyUrl] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [instagramUrl, setInstagramUrl] = useState("");
    const [soundcloudUrl, setSoundcloudUrl] = useState("");
    const [bio, setBio] = useState("");
    const [company, setCompany] = useState(""); // honeypot

    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const linkCount = [spotifyUrl, youtubeUrl, instagramUrl, soundcloudUrl].filter(
        (s) => s.trim().length > 0
    ).length;

    const canSubmit =
        firstName.trim().length > 0 &&
        lastName.trim().length > 0 &&
        stageName.trim().length > 0 &&
        email.trim().length > 0 &&
        genre.trim().length > 0 &&
        isFiveDigitZip(zip) &&
        linkCount >= 1;

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);

        if (!canSubmit) {
            setErrorMsg(
                "Please fill in all required fields. ZIP code must be 5 digits, and at least one link is required."
            );
            return;
        }
        setSubmitting(true);
        try {
            await submitArtist({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                stage_name: stageName.trim(),
                email: email.trim(),
                zip_code: zip.trim(),
                genre: genre.trim(),
                neighborhood: neighborhood.trim() || null,
                spotify_url: spotifyUrl.trim() || null,
                youtube_url: youtubeUrl.trim() || null,
                instagram_url: instagramUrl.trim() || null,
                soundcloud_url: soundcloudUrl.trim() || null,
                bio: bio.trim() || null,
                company: company.trim() || null,
            });

            setSuccessMsg(
                "Submitted! Please check your email to verify your submission. Once verified, it will be reviewed before being published."
            );
            setFirstName("");
            setLastName("");
            setStageName("");
            setEmail("");
            setZip("");
            setGenre("");
            setNeighborhood("");
            setSpotifyUrl("");
            setYoutubeUrl("");
            setInstagramUrl("");
            setSoundcloudUrl("");
            setBio("");
        } catch (err: any) {
            setErrorMsg(err?.message ?? "Submission failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 16px" }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: 20,
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: "#f2f2f2",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                }}
            >
                ← Back
            </button>

            <h1 style={{ marginBottom: 8 }}>Add yourself</h1>
            <p style={{ marginTop: 0, color: "#555" }}>
                Submit your info to be added to the local artist database. We'll ask you to verify
                your email before review.
            </p>

            {successMsg && (
                <div
                    style={{
                        padding: 12,
                        border: "1px solid #2a9d5c",
                        borderRadius: 8,
                        background: "#f0faf5",
                        marginBottom: 16,
                    }}
                >
                    {successMsg}
                </div>
            )}
            {errorMsg && (
                <div
                    style={{
                        padding: 12,
                        border: "1px solid #c0392b",
                        borderRadius: 8,
                        background: "#fdf3f2",
                        marginBottom: 16,
                        color: "#c0392b",
                    }}
                >
                    {errorMsg}
                </div>
            )}

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div style={fieldStyle}>
                        <label>First name *</label>
                        <input
                            style={inputStyle}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div style={fieldStyle}>
                        <label>Last name *</label>
                        <input
                            style={inputStyle}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>

                <div style={fieldStyle}>
                    <label>Stage name *</label>
                    <input
                        style={inputStyle}
                        value={stageName}
                        onChange={(e) => setStageName(e.target.value)}
                    />
                </div>

                <div style={fieldStyle}>
                    <label>Email *</label>
                    <input
                        style={inputStyle}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div style={fieldStyle}>
                        <label>ZIP code *</label>
                        <input
                            style={inputStyle}
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            placeholder="02139"
                            maxLength={5}
                        />
                        {zip.trim() && !isFiveDigitZip(zip) && (
                            <div style={{ color: "#c0392b", fontSize: 12 }}>Must be 5 digits</div>
                        )}
                    </div>
                    <div style={fieldStyle}>
                        <label>Genre *</label>
                        <input
                            style={inputStyle}
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            placeholder="folk, pop, soul..."
                        />
                    </div>
                </div>

                <div style={fieldStyle}>
                    <label>Neighborhood</label>
                    <input
                        style={inputStyle}
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="e.g. Jamaica Plain"
                    />
                </div>

                <hr style={{ opacity: 0.2, margin: "4px 0" }} />
                <p style={{ margin: 0, fontSize: 13, color: "#555" }}>
                    At least one link is required.
                </p>

                <div style={fieldStyle}>
                    <label>Spotify</label>
                    <input
                        style={inputStyle}
                        value={spotifyUrl}
                        onChange={(e) => setSpotifyUrl(e.target.value)}
                        placeholder="https://open.spotify.com/artist/..."
                    />
                </div>
                <div style={fieldStyle}>
                    <label>YouTube</label>
                    <input
                        style={inputStyle}
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://youtube.com/..."
                    />
                </div>
                <div style={fieldStyle}>
                    <label>Instagram</label>
                    <input
                        style={inputStyle}
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        placeholder="https://instagram.com/..."
                    />
                </div>
                <div style={fieldStyle}>
                    <label>SoundCloud</label>
                    <input
                        style={inputStyle}
                        value={soundcloudUrl}
                        onChange={(e) => setSoundcloudUrl(e.target.value)}
                        placeholder="https://soundcloud.com/..."
                    />
                </div>

                {linkCount < 1 && (
                    <div style={{ color: "#c0392b", fontSize: 13 }}>
                        Please include at least one link (Spotify, YouTube, Instagram, or SoundCloud).
                    </div>
                )}

                <div style={fieldStyle}>
                    <label>Bio</label>
                    <textarea
                        style={{ ...inputStyle, resize: "vertical" }}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                    />
                </div>

                {/* Honeypot: hidden from real users */}
                <div style={{ display: "none" }}>
                    <input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        autoComplete="off"
                        tabIndex={-1}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    style={{
                        padding: "10px 14px",
                        borderRadius: 6,
                        border: "none",
                        background: canSubmit && !submitting ? "#2a9d5c" : "#ccc",
                        color: canSubmit && !submitting ? "#fff" : "#888",
                        fontSize: 15,
                        cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
                    }}
                >
                    {submitting ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
}
