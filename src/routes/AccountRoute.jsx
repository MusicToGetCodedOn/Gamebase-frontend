import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { fetchPopularGames } from "../utils/fetchPopularGames.js";
import "./AccountRoute.css";

function AccountRoute() {
  const { token, profile } = useAuth();
  const navigate = useNavigate();

  const [tracked, setTracked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let mounted = true;
    async function loadTracked() {
      try {
        setLoading(true);
        // placeholder: use popular games as "tracked" list until real endpoint exists
        const data = await fetchPopularGames(12, 0);
        if (!mounted) return;
        setTracked(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fehler beim Laden tracked games:", err);
        if (mounted) setTracked([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadTracked();
    return () => (mounted = false);
  }, [token]);

  if (!token) return <p style={{ padding: "1rem" }}>Du bist nicht eingeloggt.</p>;
  if (!profile) return <p style={{ padding: "1rem" }}>Profil wird geladen...</p>;

  return (
    <main className="account-container">
      <div className="account-header">
        <div className="profile">
          <img src={profile.profile_image_url || "/default-avatar.png"} alt={profile.display_name} className="profile-avatar" />
          <div className="profile-info">
            <h2 className="profile-name">{profile.display_name}</h2>
            <p className="profile-handle">@{profile.login}</p>
            <div className="profile-actions">
              <LogoutButton />
            </div>
          </div>
        </div>

        <div className="account-stats">
          <div className="stat">
            <div className="stat-value">{tracked.length}</div>
            <div className="stat-label">Tracked Games</div>
          </div>
          <div className="stat">
            <div className="stat-value">—</div>
            <div className="stat-label">Member since</div>
          </div>
        </div>
      </div>

      <section className="account-section">
        <h3>Deine gespeicherten Spiele</h3>
        {loading ? (
          <p className="loading-placeholder">Lade Spiele…</p>
        ) : tracked.length === 0 ? (
          <p className="loading-placeholder">Du hast noch keine gespeicherten Spiele.</p>
        ) : (
          <div className="table-wrap">
            <table className="account-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Spiel</th>
                  <th>Genre</th>
                  <th>Rating</th>
                  <th>Release</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tracked.map((g) => (
                  <tr key={g.id}>
                    <td className="cell-cover">
                      <img src={g.cover?.url ? `https:${g.cover.url.replace("t_thumb", "t_cover_small")}` : "/default-cover.png"} alt={g.name} />
                    </td>
                    <td className="cell-title">{g.name}</td>
                    <td className="cell-genre">{g.genres && g.genres.length ? g.genres.map((x) => x.name).join(", ") : "—"}</td>
                    <td className="cell-rating">{g.rating ? Math.round(g.rating) : "N/A"}</td>
                    <td className="cell-release">{g.first_release_date ? new Date(g.first_release_date * 1000).getFullYear() : "—"}</td>
                    <td className="cell-actions">
                      <button className="btn" onClick={() => navigate(`/game/${g.id}`)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AccountRoute;
