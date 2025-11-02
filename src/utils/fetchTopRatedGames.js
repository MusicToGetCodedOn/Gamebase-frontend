export async function fetchTopRatedGames(limit = 10, offset = 0) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/games`, {
      method: "POST",
      headers: {
        "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
        Authorization: `Bearer ${import.meta.env.VITE_TWITCH_APP_TOKEN || ""}`,
        "Content-Type": "text/plain",
      },
      body: `
        fields name, cover.url, rating, genres.name, first_release_date;
        sort rating desc;
        limit ${limit};
        offset ${offset};
        where rating >= 85 & cover != null;
      `,
    });

    if (!res.ok) throw new Error(`Fehler: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ Fehler beim Abrufen der Spiele:", err);
    return [];
  }
}