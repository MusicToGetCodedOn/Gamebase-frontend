import GameGrid from "../components/Gamegrid.jsx";
import Herosection from "../components/Herosection.jsx";
import LoadMoreButton from "../components/LoadMoreButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import GameCarousel from "../components/GameCarousel.jsx";
import FilterModal from "../components/FilterModal";
import SortIcon from "../assets/icons/sort_icon.png";
import { fetchFilteredGames } from "../utils/fetchFilteredGames.js";

function HomeRoute() {
  const { token } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({});

  // 🧠 Neuer Effekt: reagiert auf token UND filters
  useEffect(() => {
    if (!token) return;

    async function loadGames() {
      try {
        setLoading(true);

        // 🆕 Wenn Filter aktiv sind, lade gefilterte Games
        if (Object.keys(filters).length > 0) {
          const filtered = await fetchFilteredGames(filters);
          setGames(filtered);
          setHasMore(false); // Filter ignoriert Pagination
          setOffset(0);
        } else {
          // 👇 ansonsten lade normale (Top Rated) Games
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/games`, {
            method: "POST",
            headers: {
              "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
              Authorization: `Bearer ${token}`,
              "Content-Type": "text/plain",
            },
            body: `
              fields name, cover.url, rating, genres.name, first_release_date;
              sort rating desc;
              limit ${LIMIT};
              offset 0;
            `,
          });

          if (!res.ok) throw new Error(`Fehler: ${res.status}`);

          const data = await res.json();
          setGames(data);
          setOffset(LIMIT);
          setHasMore(data.length === LIMIT);
        }
      } catch (err) {
        console.error("❌ Fehler beim Laden der Games:", err);
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, [token, filters]); // 👈 Filter hinzugefügt

  // 📥 Load More nur aktiv, wenn KEIN Filter gesetzt ist
  const loadMoreGames = async () => {
    if (!token || loadingMore || Object.keys(filters).length > 0) return;

    try {
      setLoadingMore(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/games`, {
        method: "POST",
        headers: {
          "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain",
        },
        body: `
          fields name, cover.url, rating, genres.name, first_release_date;
          sort rating desc;
          limit ${LIMIT};
          offset ${offset};
        `,
      });

      if (!res.ok) throw new Error(`Fehler: ${res.status}`);

      const data = await res.json();
      setGames((prevGames) => [...prevGames, ...data]);
      setOffset((prevOffset) => prevOffset + LIMIT);
      setHasMore(data.length === LIMIT);
    } catch (err) {
      console.error("Fehler beim Laden weiterer Games:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", color: "var(--text-color)" }}>Welcome to GameBase</h1>
      <Herosection />

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading games...</p>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "1rem 2rem" }}>
            <h5 style={{ color: "var(--text-color)" }}>Top Rated Games</h5>
            <button className="filter-btn" onClick={() => setShowFilter(true)}>
              <img src={SortIcon} alt="Sort Icon" />
            </button>
          </div>

          <GameCarousel games={games} />
          <GameGrid games={games} />

          {!Object.keys(filters).length && (
            <LoadMoreButton
              onClick={loadMoreGames}
              loading={loadingMore}
              hasMore={hasMore}
            />
          )}
        </>
      )}

      <FilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={(newFilters) => setFilters(newFilters)} // 👈 Filter speichern
      />
    </div>
  );
}

export default HomeRoute;
