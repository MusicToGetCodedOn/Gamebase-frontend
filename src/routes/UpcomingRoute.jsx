import { useEffect, useState } from "react";
import GameGrid from "../components/Gamegrid.jsx";
import "./routes.css";

function UpcomingRoute() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function loadUpcoming() {
            try {
                setLoading(true);
                const now = Math.floor(Date.now() / 1000);
                const body = `fields name, cover.url, rating, genres.name, first_release_date; where first_release_date > ${now} & cover != null; sort first_release_date asc; limit 40;`;
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/games`, {
                    method: "POST",
                    headers: {
                        "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
                        Authorization: `Bearer ${import.meta.env.VITE_TWITCH_APP_TOKEN || ""}`,
                        "Content-Type": "text/plain",
                    },
                    body,
                });

                if (!res.ok) throw new Error(`Fehler: ${res.status}`);
                const data = await res.json();
                if (!mounted) return;
                setGames(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Fehler beim Laden kommende Spiele:", err);
                if (mounted) setGames([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadUpcoming();
        return () => (mounted = false);
    }, []);

    return (
        <div className="route-container">
            <header className="route-header">
                <h1 className="route-title">Upcoming</h1>
                <p className="route-subtitle">Spiele mit anstehendem Veröffentlichungsdatum. Plane voraus und behalte neue Releases im Blick.</p>
            </header>

            <main className="route-section">
                {loading ? (
                    <p className="loading-placeholder">Lade kommende Spiele…</p>
                ) : (
                    <GameGrid games={games} />
                )}
            </main>
        </div>
    );
}

export default UpcomingRoute;