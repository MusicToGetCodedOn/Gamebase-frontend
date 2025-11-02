// src/utils/fetchFilteredGames.js
export async function fetchFilteredGames(filters = {}) {
  const { limit = 20, offset = 0, genre, platform, sort = "rating desc" } = filters;

  const where = [
    "cover != null",
    genre ? `genres.name = "${genre}"` : "",
    platform ? `platforms.name = "${platform}"` : "",
  ]
    .filter(Boolean)
    .join(" & ");

  const body = `
    fields name, cover.url, rating, genres.name, platforms.name, first_release_date;
    sort ${sort};
    where ${where};
    limit ${limit};
    offset ${offset};
  `;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/games`, {
      method: "POST",
      headers: {
        "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
        Authorization: `Bearer ${import.meta.env.VITE_TWITCH_APP_TOKEN || ""}`,
        "Content-Type": "text/plain",
      },
      body,
    });

    if (!res.ok) throw new Error(`Fehler: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("❌ Fehler beim Laden der gefilterten Games:", err);
    return [];
  }
}
