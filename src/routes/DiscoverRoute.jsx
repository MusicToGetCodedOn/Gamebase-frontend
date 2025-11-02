

import { useEffect, useState } from "react";
import GameGrid from "../components/Gamegrid.jsx";
import { fetchFilteredGames } from "../utils/fetchFilteredGames.js";
import "./routes.css";

function DiscoverRoute() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const filters = genre ? { genre, limit: 24 } : { limit: 24 };
        const data = await fetchFilteredGames(filters);
        if (!mounted) return;
        setGames(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fehler beim Laden der Discover-Games:", err);
        if (mounted) setGames([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [genre]);

  return (
    <div className="route-container">
      <header className="route-header">
        <h1 className="route-title">Discover</h1>
        <p className="route-subtitle">Entdecke neue Spiele – filtere nach Genre, probiere verschiedene Kategorien</p>

        <div className="route-controls">
          <label htmlFor="genre-select" style={{ color: "var(--text-color)" }}>Genre:</label>
          <select id="genre-select" value={genre} onChange={(e) => setGenre(e.target.value)} className="select-genre">
            <option value="">Alle Genres</option>
            <option value="Action">Action</option>
            <option value="RPG">RPG</option>
            <option value="Adventure">Adventure</option>
            <option value="Shooter">Shooter</option>
            <option value="Indie">Indie</option>
          </select>
        </div>
      </header>

      <main className="route-section">
        {loading ? (
          <p className="loading-placeholder">Lade Spiele…</p>
        ) : (
          <GameGrid games={games} />
        )}
      </main>
    </div>
  );
}

export default DiscoverRoute;
