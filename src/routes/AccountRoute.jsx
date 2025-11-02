import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { fetchPopularGames } from "../utils/fetchPopularGames.js";
import "./AccountRoute.css";
import { getSavedList, removeGameFromList } from "../utils/savedLists";

function AccountRoute() {
  const { token, profile } = useAuth();
  const navigate = useNavigate();

  const [tracked, setTracked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState([]);



  // load saved "Currently playing" list from localStorage (per user)
  useEffect(() => {
    if (!profile) return;
    try {
      const list = getSavedList(profile.id);
      setSaved(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Fehler beim Laden der gespeicherten Liste:", err);
      setSaved([]);
    }
  }, [profile]);

  if (!token) return <p style={{ padding: "1rem" }}>Du bist nicht eingeloggt.</p>;
  if (!profile) return <p style={{ padding: "1rem" }}>Profil wird geladen...</p>;

  return (
    <main className="account-container">
      <div className="account-header">
        <div className="profile">
          <img src={profile.profile_image_url || "/default-avatar.png"} alt={profile.display_name} className="profile-avatar" style={{ marginRight: "2rem" }} />
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
            <div className="stat-value">{saved.length}</div>
            <div className="stat-label">Currently playing</div>
          </div>
          <div className="stat">
            <div className="stat-value">—</div>
            <div className="stat-label">Member since</div>
          </div>
        </div>
      </div>

      <section className="account-section">
        <h3>Currently playing</h3>
        {saved.length === 0 ? (
          <p className="loading-placeholder">Du spielst momentan nichts.</p>
        ) : (
          <div className="table-wrap">
            <table className="account-table">
              <thead className="account-table__head">
                <tr className="account-table__row">
                  <th className="account-table__head-cell"></th>
                  <th className="account-table__head-cell">Spiel</th>
                  <th className="account-table__head-cell">Genre</th>
                  <th className="account-table__head-cell">Rating</th>
                  <th className="account-table__head-cell">Release</th>
                  <th className="account-table__head-cell"></th>
                </tr>
              </thead>
              <tbody className="account-table__body">
                {saved.map((g) => (
                  <tr key={g.id} className="account-table__row">
                    <td className="cell-cover account-table__cell">
                      <img className="cell-cover__img" src={g.cover ? g.cover.replace("t_thumb", "t_cover_small") : "/default-cover.png"} alt={g.name} />
                    </td>
                    <td className="cell-title account-table__cell">{g.name}</td>
                    <td className="cell-genre account-table__cell">{g.genres && g.genres.length ? g.genres.map((x) => x.name).join(", ") : "—"}</td>
                    <td className="cell-rating account-table__cell">{g.rating ? Math.round(g.rating) : "N/A"}</td>
                    <td className="cell-release account-table__cell">{g.first_release_date ? new Date(g.first_release_date * 1000).getFullYear() : "—"}</td>
                    <td className="cell-actions account-table__cell">
                      <button className="btn" onClick={() => navigate(`/game/${g.id}`)}>View</button>
                      <button
                        className="btn btn-ghost"
                        onClick={() => {
                          removeGameFromList(profile.id, g.id);
                          setSaved((s) => s.filter((it) => String(it.id) !== String(g.id)));
                        }}
                      >
                        Entfernen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <hr style={{ margin: "2rem 0" }} />

       
       


      </section>
      <div style={{marginBottom:"100vh"}}></div>
    </main>
  );
}

export default AccountRoute;
