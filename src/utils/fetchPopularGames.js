export async function fetchPopularGames(limit = 15, offset = 0) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/games`, {
      method: "POST",
      headers: {
        "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
        Authorization: `Bearer ${import.meta.env.VITE_TWITCH_APP_TOKEN || ""}`,
        "Content-Type": "text/plain",
      },
      body: `
        fields name, cover.url, rating, total_rating_count, genres.name, first_release_date;
        sort total_rating_count desc;
        where total_rating_count > 50 & cover != null;
        limit ${limit};
        offset ${offset};
      `,
    });

    if (!res.ok) throw new Error("Fehler beim Laden der Popular Games");
    return await res.json();
  } catch (err) {
    console.error("❌ Fehler beim Laden der Popular Games:", err);
    return [];
  }
}
