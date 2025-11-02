import GameGrid from "../components/Gamegrid.jsx";
import Herosection from "../components/Herosection.jsx";
import LoadMoreButton from "../components/LoadMoreButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import GameCarousel from "../components/GameCarousel.jsx";
import FilterModal from "../components/FilterModal";
import SortIcon from "../assets/icons/sort_icon.png";
import { fetchFilteredGames } from "../utils/fetchFilteredGames.js";
import { fetchTopRatedGames } from "../utils/fetchTopRatedGames.js";
import { fetchPopularGames } from "../utils/fetchPopularGames.js";

function HomeRoute() {
  const { token } = useAuth();
  const [gridGames, setGridGames] = useState([]); // 🔹 für GameGrid
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);



  // 🧠 1. Top Rated Games (Carousel) — lädt EINMAL;
  useEffect(() => {
    if (!token) return;

    async function loadAll() {
      try {
        const [rated, pop, trend] = await Promise.all([
          fetchTopRatedGames(15, 0),
          fetchPopularGames(15, 0),
          
        ]);
        setTopRated(rated || []);
        setPopular(pop || []);
      } catch (err) {
        console.error("Fehler beim Laden der Carousels:", err);
      }
    }

    loadAll();
  }, [token]);


  // 🧠 2. Grid Games (mit Filter)
  useEffect(() => {
    if (!token) return;

    async function loadGridGames() {
      try {
        setLoading(true);

        if (Object.keys(filters).length > 0) {
          // 🔸 Wenn Filter aktiv, gefilterte Games laden
          const filtered = await fetchFilteredGames(filters);
          setGridGames(filtered);
          setHasMore(false);
          setOffset(0);
        } else {
          // 🔸 Standard-Liste (z. B. alle Spiele)
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
          setGridGames(data);
          setOffset(LIMIT);
          setHasMore(data.length === LIMIT);
        }
      } catch (err) {
        console.error("Fehler beim Laden der Grid Games:", err);
      } finally {
        setLoading(false);
      }
    }

    loadGridGames();
  }, [token, filters]);

  // 📥 Load More (nur für GameGrid)
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
          sort total_rating_count desc;
          limit ${LIMIT};
          offset ${offset};
        `,
      });

      if (!res.ok) throw new Error(`Fehler: ${res.status}`);
      const data = await res.json();
      setGridGames((prevGames) => [...prevGames, ...data]);
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
    <h1 style={{ textAlign: "center", color: "var(--text-color)" }}>
      Welcome to GameBase
    </h1>

    <Herosection />

    {/* Carousel */}
    <section style={{ marginTop: "2rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
      <h5 style={{ color: "var(--text-color)", marginLeft: "2rem" }}>Top Rated Games</h5>
      <GameCarousel games={topRated} duration={25} />
    </section>

    <section style={{ marginTop: "2rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
      <h5 style={{ color: "var(--text-color)", marginLeft: "2rem" }}>Popular Right Now</h5>
      <GameCarousel games={popular} duration={25} />
    </section>

    {/* 🟣 Filter + GameGrid */}
    <section style={{ marginTop: "2rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "1rem 2rem",
        }}
      >
        <h5 style={{ color: "var(--text-color)" }}>All Games</h5>
        <button className="filter-btn" onClick={() => setShowFilter(true)}>
          <img src={SortIcon} alt="Sort Icon" />
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading games...</p>
      ) : (
        <>
          <GameGrid games={gridGames} />
          {!Object.keys(filters).length && (
            <LoadMoreButton
              onClick={loadMoreGames}
              loading={loadingMore}
              hasMore={hasMore}
            />
          )}
        </>
      )}
    </section>

    {/* Modal */}
    <FilterModal
      open={showFilter}
      onClose={() => setShowFilter(false)}
      onApply={(newFilters) => setFilters(newFilters)}
    />
  </div>
);
}

export default HomeRoute;
