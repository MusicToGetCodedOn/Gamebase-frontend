import { useEffect, useState } from "react";
import GameGrid from "../components/Gamegrid.jsx";
import { fetchTopRatedGames } from "../utils/fetchTopRatedGames.js";
import "./routes.css";
import { useAuth } from "../context/AuthContext.jsx";

function TopRatedRoute() {
  const { token } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadTop() {
      try {
        setLoading(true);
        const data = await fetchTopRatedGames(30, 0);
        if (!mounted) return;
        setGames(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fehler beim Laden Top Rated:", err);
        if (mounted) setGames([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadTop();
    return () => (mounted = false);
  }, []);

  return (
    <div className="route-container">
      <header className="route-header">
        <h1 className="route-title">Top Rated</h1>
        <p className="route-subtitle">Die bestbewerteten Spiele — basierend auf Bewertungen.</p>
      </header>

      <main className="route-section">
        {loading ? (
          <p className="loading-placeholder">Lade Top Rated Spiele…</p>
        ) : (
          <GameGrid games={games} />
        )}
      </main>
    </div>
  );
}

export default TopRatedRoute;
