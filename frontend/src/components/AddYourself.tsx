import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { submitArtist } from "../api/submissions";

function isFiveDigitZip(zip: string) {
    return /^\d{5}$/.test(zip.trim());
}

export default function AddYourself() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [stageName, setStageName] = useState("");
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [zip, setZip] = useState("");
    const [genre, setGenre] = useState("");
    const [spotifyUrl, setSpotifyUrl] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [bio, setBio] = useState("");
    const [company, setCompany] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    /*const linkCount = useMemo(() => {
        return [spotifyUrl, youtubeUrl].filter((s) => s.trim().length > 0).length;
    }, [spotifyUrl, youtubeUrl]);

    const canSubmit = useMemo(() => {
        if (!firstName.trim()) return false;
        if (!lastName.trim()) return false;
        if (!email.trim()) return false;
        if (!zip.trim() || !isFiveDigitZip(zip)) return false;
        if (linkCount < 1) return false;
        return true;
    }, [firstName, lastName, zip, genre, email, stageName]);*/

    const linkCount = [spotifyUrl, spotifyUrl, youtubeUrl].filter((s) => s.trim().length > 0).length;
    const canSubmit =
      firstName.trim().length > 0 &&
      lastName.trim().length >0 &&
      stageName.trim().length > 0 &&
      email.trim().length > 0 &&
      (zip.trim().length === 0 || isFiveDigitZip(zip)) &&
      linkCount >= 1;

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);

        if (!canSubmit) {
            setErrorMsg("Please fill in required fields. Zip code must be 5 digits, and you must include at least one link");
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                stage_name: stageName.trim(),
                email: email.trim(),
                zip_code: zip.trim(),
                genre: genre.trim() ? genre.trim() : null,
                neighborhood: neighborhood.trim() ? neighborhood.trim() : null,
                spotify_url: spotifyUrl.trim() ? spotifyUrl.trim() : null,
                youtube_url: youtubeUrl.trim() ? youtubeUrl.trim() : null,
                bio: bio.trim() ? bio.trim() : null,
                company: company.trim() ? company.trim() : null, // honeypot
            };

            await submitArtist(payload);

            setSuccessMsg(
                "Submitted! Please check your email to verify your submission. Once verified, it will be reviewed before being published."
            );
            setFirstName("");
            setLastName("");
            setStageName("");
            setEmail("");
            setZip("");
            setGenre("");
            setSpotifyUrl("");
            setYoutubeUrl("");
            setBio("");
            setCompany("");
        } catch (err: any) {
            setErrorMsg(err?.message ?? "Submission failed");
        } finally {
            setSubmitting(false);
        }
    }
    return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px" }}>
      <button
      onClick={() => {
                navigate(-1);
              }}
      style={{
        marginBottom: "20px",
        padding: "8px 12px",
        borderRadius: "6px",
        background: "#f2f2f2",
        border: "1px solid #ccc",
        cursor: "pointer"
      }}  
    >
      ← Back
    </button>
      <h1 style={{ marginBottom: 8 }}>Add yourself</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Submit your info to be added to the local artist database. We’ll ask you to verify your email before review.
      </p>

      {successMsg && (
        <div style={{ padding: 12, border: "1px solid #2d8", borderRadius: 8, marginBottom: 16 }}>
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{ padding: 12, border: "1px solid #d44", borderRadius: 8, marginBottom: 16 }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <label>First name *</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Last name *</label>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Stage name *</label>
          <input value={stageName} onChange={(e) => setStageName(e.target.value)} />
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Email *</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} onInput={(e) => setEmail((e.target as HTMLInputElement).value)} type="email" />
        </div>
        <div style={{ display: "grid", gap: 6 }} >
          <label>ZIP code (5 digits) *</label>
          <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="02139" />
          {zip.trim() && !isFiveDigitZip(zip) && (
            <div style={{ color: "#d44", fontSize: 12 }}>ZIP must be 5 digits</div>
          )}
        </div>
         <div style={{ display: "grid", gap: 6 }}>
          <label>Neighborhood</label>
          <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <label>Genre</label>
          <input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="folk, pop, soul..." />
        </div>

        <hr style={{ opacity: 0.2 }} />

        <div style={{ display: "grid", gap: 6 }}>
          <label>Spotify link</label>
          <input value={spotifyUrl} onChange={(e) => setSpotifyUrl(e.target.value)} placeholder="https://open.spotify.com/artist/..." />
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <label>Youtube link</label>
          <input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/..." />
        </div>

        {linkCount < 1 && (
          <div style={{ color: "#d44", fontSize: 12 }}>Please include at least one link (Spotify or Youtube).</div>
        )}

        <div style={{ display: "grid", gap: 6 }}>
          <label>Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
        </div>

        {/* Honeypot: hide visually; bots often fill it */}
        <div style={{ display: "none" }}>
          <label>Company</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="off" />
        </div>

        <pre style={{ fontSize: 12, opacity: 0.8 }}>
          {JSON.stringify(
            { firstName, email, zip, spotifyUrl, youtubeUrl, linkCount, canSubmit, submitting },
            null,
            2
          )}
        </pre>

        <button type="submit" disabled={!canSubmit || submitting} style={{ padding: "10px 14px" }}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}