import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitArtist } from "../api/submissions";

const API_URL = import.meta.env.VITE_API_URL;

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
    const [city, setCity] = useState("");
    const [stateAbbr, setStateAbbr] = useState("");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [neighborhood, setNeighborhood] = useState("");
    const [spotifyUrl, setSpotifyUrl] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [instagramUrl, setInstagramUrl] = useState("");
    const [soundcloudUrl, setSoundcloudUrl] = useState("");
    const [bio, setBio] = useState("");
    const [company, setCompany] = useState(""); // honeypot

    const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
    const [instrumentOtherText, setInstrumentOtherText] = useState("");
    const [showInstrumentOther, setShowInstrumentOther] = useState(false);

    const [genres, setGenres] = useState<string[]>([]);
    const [instruments, setInstruments] = useState<string[]>([]);
    const [zipError, setZipError] = useState<string | null>(null);
    const [checkedZip, setCheckedZip] = useState<string | null>(null);

    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/artists/genres`)
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((data) => setGenres(data.genres ?? []))
            .catch(() => {});
        fetch(`${API_URL}/artists/instruments`)
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((data) => setInstruments(data.instruments ?? []))
            .catch(() => {});
    }, []);

    useEffect(() => {
        const z = zip.trim();
        if (!isFiveDigitZip(z)) {
            setZipError(null);
            setCheckedZip(null);
            return;
        }
        let cancelled = false;
        fetch(`${API_URL}/artists/zip-lookup?zip=${z}`)
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("not found");
            })
            .then((data) => {
                if (cancelled) return;
                setZipError(null);
                setCheckedZip(z);
                if (data.neighborhood) setNeighborhood(data.neighborhood);
                if (data.city) setCity(data.city);
            })
            .catch(() => {
                if (cancelled) return;
                setZipError("ZIP code not in our area");
                setCheckedZip(z);
            });
        return () => { cancelled = true; };
    }, [zip]);

    const zipIsValid = isFiveDigitZip(zip) && checkedZip === zip.trim() && zipError === null;

    function addInstrument(value: string) {
        const v = value.trim();
        if (v && !selectedInstruments.includes(v) && selectedInstruments.length < 6) {
            setSelectedInstruments([...selectedInstruments, v]);
        }
    }

    function handleInstrumentSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value;
        e.target.value = "";
        if (!val) return;
        if (val === "__other__") {
            setShowInstrumentOther(true);
        } else {
            addInstrument(val);
        }
    }

    function commitInstrumentOther() {
        const v = instrumentOtherText.trim();
        if (v) {
            addInstrument(v);
            setInstrumentOtherText("");
            setShowInstrumentOther(false);
        }
    }

    const linkCount = [spotifyUrl, youtubeUrl, instagramUrl, soundcloudUrl].filter(
        (s) => s.trim().length > 0
    ).length;

    const canSubmit =
        firstName.trim().length > 0 &&
        lastName.trim().length > 0 &&
        stageName.trim().length > 0 &&
        email.trim().length > 0 &&
        selectedGenres.length > 0 &&
        zipIsValid &&
        city.trim().length > 0 &&
        stateAbbr.trim().length === 2 &&
        linkCount >= 1;

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);

        if (!canSubmit) {
            setErrorMsg(
                "Please fill in all required fields. ZIP code must be in our area, state must be a 2-letter abbreviation, and at least one link is required."
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
                city: city.trim() || null,
                state: stateAbbr.trim().toUpperCase() || null,
                genres: selectedGenres,
                instruments: selectedInstruments.length > 0 ? selectedInstruments : null,
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
            setCity("");
            setStateAbbr("");
            setSelectedGenres([]);
            setSelectedInstruments([]);
            setInstrumentOtherText("");
            setShowInstrumentOther(false);
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
                    <div>{successMsg}</div>
                    <a href="/" style={{ display: "inline-block", marginTop: 10, color: "#2a9d5c", fontWeight: 500 }}>
                        ← Back to search
                    </a>
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
                        {zipError && (
                            <div style={{ color: "#c0392b", fontSize: 12 }}>{zipError}</div>
                        )}
                    </div>
                    <div style={fieldStyle}>
                        <label>Genre * <span style={{ fontWeight: "normal", color: "#777", fontSize: 12 }}>(up to 5)</span></label>
                        <select
                            style={inputStyle}
                            value=""
                            disabled={selectedGenres.length >= 5}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val && !selectedGenres.includes(val) && selectedGenres.length < 5) {
                                    setSelectedGenres([...selectedGenres, val]);
                                }
                                e.target.value = "";
                            }}
                        >
                            <option value="">
                                {selectedGenres.length >= 5 ? "Max 5 genres selected" : "Add a genre..."}
                            </option>
                            {genres.filter((g) => !selectedGenres.includes(g)).map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                        {selectedGenres.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                                {selectedGenres.map((g) => (
                                    <span
                                        key={g}
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 4,
                                            padding: "3px 8px",
                                            borderRadius: 12,
                                            background: "#e8f5ef",
                                            border: "1px solid #2a9d5c",
                                            fontSize: 13,
                                        }}
                                    >
                                        {g}
                                        <button
                                            type="button"
                                            onClick={() => setSelectedGenres(selectedGenres.filter((x) => x !== g))}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                padding: 0,
                                                lineHeight: 1,
                                                color: "#2a9d5c",
                                                fontSize: 14,
                                                fontWeight: "bold",
                                            }}
                                            aria-label={`Remove ${g}`}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div style={fieldStyle}>
                    <label>Instrument(s) <span style={{ fontWeight: "normal", color: "#777", fontSize: 12 }}>(up to 6, optional)</span></label>
                    <select
                        style={inputStyle}
                        value=""
                        disabled={selectedInstruments.length >= 6}
                        onChange={handleInstrumentSelect}
                    >
                        <option value="">
                            {selectedInstruments.length >= 6 ? "Max 6 instruments selected" : "Add an instrument..."}
                        </option>
                        {instruments
                            .filter((inst) => !selectedInstruments.includes(inst))
                            .map((inst) => (
                                <option key={inst} value={inst}>{inst}</option>
                            ))
                        }
                        {!showInstrumentOther && selectedInstruments.length < 6 && (
                            <option value="__other__">Other (type your own)</option>
                        )}
                    </select>

                    {showInstrumentOther && (
                        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                            <input
                                style={{ ...inputStyle, flex: 1 }}
                                placeholder="Enter instrument name"
                                value={instrumentOtherText}
                                onChange={(e) => setInstrumentOtherText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") { e.preventDefault(); commitInstrumentOther(); }
                                }}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={commitInstrumentOther}
                                disabled={!instrumentOtherText.trim()}
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: 6,
                                    border: "1px solid #2a9d5c",
                                    background: instrumentOtherText.trim() ? "#2a9d5c" : "#ccc",
                                    color: instrumentOtherText.trim() ? "#fff" : "#888",
                                    cursor: instrumentOtherText.trim() ? "pointer" : "not-allowed",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Add
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowInstrumentOther(false); setInstrumentOtherText(""); }}
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: 6,
                                    border: "1px solid #ccc",
                                    background: "#f2f2f2",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {selectedInstruments.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                            {selectedInstruments.map((inst) => (
                                <span
                                    key={inst}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 4,
                                        padding: "3px 8px",
                                        borderRadius: 12,
                                        background: "#edf2fb",
                                        border: "1px solid #4a6fa5",
                                        fontSize: 13,
                                    }}
                                >
                                    {inst}
                                    <button
                                        type="button"
                                        onClick={() => setSelectedInstruments(selectedInstruments.filter((x) => x !== inst))}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: 0,
                                            lineHeight: 1,
                                            color: "#4a6fa5",
                                            fontSize: 14,
                                            fontWeight: "bold",
                                        }}
                                        aria-label={`Remove ${inst}`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
                    <div style={fieldStyle}>
                        <label>City *</label>
                        <input
                            style={inputStyle}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Boston"
                        />
                    </div>
                    <div style={fieldStyle}>
                        <label>State *</label>
                        <input
                            style={inputStyle}
                            value={stateAbbr}
                            onChange={(e) => setStateAbbr(e.target.value)}
                            placeholder="MA"
                            maxLength={2}
                        />
                        {stateAbbr.trim().length > 0 && stateAbbr.trim().length !== 2 && (
                            <div style={{ color: "#c0392b", fontSize: 12 }}>Must be 2-letter abbreviation</div>
                        )}
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
