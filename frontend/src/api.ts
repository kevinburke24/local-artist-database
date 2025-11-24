const API_URL = "http://localhost:8000";

export async function fetchArtists() {
  const res = await fetch(`${API_URL}/artists`);
  if (!res.ok) {
    throw new Error("Failed to fetch artists");
  }
  return res.json();
}