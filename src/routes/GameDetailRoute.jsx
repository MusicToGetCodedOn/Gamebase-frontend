import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./GameDetail.css";

function GameDetailRoute() {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGame() {
      try {
        console.log("🟣 Lade Spiel mit ID:", id);
        const res = await fetch(`${VITE_API_BASE_URL}/api/games`, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: `
        fields name, id, summary, rating, cover.url;
        where id = ${id};
        limit 1;
      `,
        });

        const text = await res.text();
        console.log("🟡 Rohe Antwort:", text);
        try {
          const data = JSON.parse(text);
          console.log("🟢 JSON Antwort:", data);
          setGame(data[0] || null);
        } catch (err) {
          console.error("🔴 JSON Parse Error:", err);
        }
      } catch (err) {
        console.error("❌ Fetch Fehler:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGame();
  }, [id]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>🎮 Lade Spieldetails...</h2>
      </div>
    );

  if (!game)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>Spiel nicht gefunden 😢</h2>
        <Link to="/">← Zurück zur Übersicht</Link>
      </div>
    );

  // 🎨 Publisher auslesen
  const publisher =
    game.involved_companies?.find((c) => c.publisher)?.company?.name ||
    "Unbekannter Publisher";

  // 🎨 Datum formatieren
  const formatDate = (unix) => {
    if (!unix) return "Unbekanntes Datum";
    const date = new Date(unix * 1000);
    return date.toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // 🎨 Hintergrundbild für Atmosphäre
  const background = game.cover
    ? `https:${game.cover.url.replace("t_thumb", "t_1080p")}`
    : null;

  return (
    <div
      className="game-detail"
      style={{
        backgroundImage: background
          ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${background})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="game-detail__content">
        <img
          src={`https:${game.cover.url.replace("t_thumb", "t_cover_big")}`}
          alt={game.name}
          className="game-detail__cover"
        />

        <div className="game-detail__info">
          <h1>{game.name}</h1>
          <p className="game-detail__genre">
            {game.genres?.map((g) => g.name).join(", ") || "Unbekanntes Genre"}
          </p>
          <p className="game-detail__rating">
            ⭐ {Math.round(game.rating) || "N/A"} / 100
          </p>
          <p className="game-detail__publisher">🏢 {publisher}</p>
          <p className="game-detail__release">
            📅 {formatDate(game.first_release_date)}
          </p>

          <p className="game-detail__description">
            {game.summary || "Keine Beschreibung verfügbar."}
          </p>

          <Link to="/" className="back-link">
            ← Zurück
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GameDetailRoute;
