import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./GameDetail.css";
import { useAuth } from "../context/AuthContext";
import { addGameToList, removeGameFromList, isGameSaved } from "../utils/savedLists";
import add from "../assets/icons/add.png";
import remove from "../assets/icons/remove.png";
import { useToast } from "../context/ToastContext";

function GameDetailRoute() {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchGame() {
      try {
      
        const res = await fetch(`${VITE_API_BASE_URL}/api/games`, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: `
        fields name, id, summary, rating, cover.url, genres.name, first_release_date, involved_companies.company.name, involved_companies.publisher, platforms.name;
        where id = ${id};
        limit 1;
      `,
        });

        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setGame(data[0] || null);
          // after we have the game, check saved state
          if (data && data[0] && profile) {
            try {
              setIsSaved(isGameSaved(profile.id, data[0].id));
            } catch (e) {
              // ignore
            }
          }
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

  // if profile changes, re-check saved state
  useEffect(() => {
    if (!game || !profile) return;
    try {
      setIsSaved(isGameSaved(profile.id, game.id));
    } catch (e) {
      console.error(e);
    }
  }, [profile, game]);

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
    
    
    const platforms =
    game.platforms?.map((p) => p.name).join(", ") || "Unbekannte Plattformen";

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
          <p className="game-detail__platforms">🎮 {platforms}</p>

          <p className="game-detail__description">
            {game.summary || "Keine Beschreibung verfügbar."}
          </p>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "1rem" }}>
            

            <Link to="/" className="back-link">
              ← Zurück
            </Link>
            {profile ? (
              <button
                className={isSaved ? "btn btn-ghost" : "btn btn-primary"}
                style={{ marginLeft: "10%", display: "flex", alignItems: "center", gap: "0.5rem" }}
                onClick={() => {
                  if (!profile) return;
                  if (isSaved) {
                    removeGameFromList(profile.id, game.id);
                    showToast(`🗑️ "${game.name}" von deiner Liste entfernt`, "warning");
                    setIsSaved(false);
                  } else {
                    addGameToList(profile.id, game);
                    showToast(`✅ "${game.name}" zu deiner Liste hinzugefügt`, "success");
                    setIsSaved(true);
                  }
                }}
              >
                {isSaved ? <img src={remove} alt="Entfernen" style={{ width: "1rem", height: "1rem" }} /> : <img src={add} alt="Hinzufügen" style={{ width: "1rem", height: "1rem" }} />}
              </button>
            ) : (
              <button className="btn btn-ghost" onClick={() => alert("Bitte einloggen, um Spiele zu speichern.")}>Zu Liste hinzufügen</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDetailRoute;
