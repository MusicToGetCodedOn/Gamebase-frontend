import { useEffect, useState } from "react";
import { fetchPopularGames } from "../utils/fetchPopularGames.js";
import GameGrid from "../components/Gamegrid.jsx";
import "./routes.css";

function TrendingRoute() {
    const [popular, setPopular] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function loadPopular() {
            try {
                setLoading(true);
                const data = await fetchPopularGames(30, 0);
                if (!mounted) return;
                setPopular(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Fehler beim Laden der beliebten Spiele:", err);
                if (mounted) setPopular([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadPopular();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="route-container">
            <header className="route-header">
                <h1 className="route-title">Popular Games</h1>
            </header>

            <main className="route-section">
                {loading ? (
                    <p className="loading-placeholder">Loading popular games...</p>
                ) : (
                    <GameGrid games={popular} />
                )}
            </main>
        </div>
    );
}

export default TrendingRoute;