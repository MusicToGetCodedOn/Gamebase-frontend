import GameGrid from "../components/Gamegrid.jsx";
import Herosection from "../components/Herosection.jsx";
import LoadMoreButton from "../components/LoadMoreButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";


function HomeRoute() {
  const { token } = useAuth(); 
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  useEffect(() => {
    const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    if (!token) return; // Wenn kein Token vorhanden ist, noch nichts laden

    async function fetchGames() {
      try {
        setLoading(true);
        const res = await fetch(`${VITE_API_BASE_URL}/api/games`, {
          method: "POST",
          headers: {
            "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
          },
          body: `
            fields name, cover.url, rating, genres.name, first_release_date;
            limit ${LIMIT};
            offset 0;
          `,
        });

        if (!res.ok) {
          throw new Error(`Fehler: ${res.status}`);
        }

        const data = await res.json();
        setGames(data);
        setOffset(LIMIT);
        setHasMore(data.length === LIMIT);
      } catch (err) {
        console.error("Fehler beim Laden der Games:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, [token]);

  const loadMoreGames = async () => {
    if (!token || loadingMore) return;

    try {
      setLoadingMore(true);
      const res = await fetch(`${VITE_API_BASE_URL}/api/games`, {
        method: "POST",
        headers: {
          "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain",
        },
        body: `
          fields name, cover.url, rating, genres.name, first_release_date;
          limit ${LIMIT};
          offset ${offset};
        `,
      });

      if (!res.ok) {
        throw new Error(`Fehler: ${res.status}`);
      }

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
          <GameGrid games={games} />
          <LoadMoreButton 
            onClick={loadMoreGames}
            loading={loadingMore}
            hasMore={hasMore}
          />
        </>
      )}
    </div>
  );
}

export default HomeRoute;
