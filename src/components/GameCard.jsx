import "./GameCard.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  addGameToList,
  removeGameFromList,
  isGameSaved,
} from "../utils/savedLists";
import add from "../assets/icons/add.png";
import remove from "../assets/icons/remove.png";
import { useToast } from "../context/ToastContext";

function GameCard({ id, cover, name, genre, rating, first_release_date }) {
  const { profile } = useAuth();
  const { showToast } = useToast();

  const saved = profile ? isGameSaved(profile.id, id) : false;
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="game-card">
      <Link to={`/game/${id}`} className="game-card-link">
        {cover ? (
          <img src={cover} alt={name} className="game-card-cover" />
        ) : (
          <div className="game-card-placeholder">Kein Bild</div>
        )}
      </Link>

      <div className="game-card-info">
        <h3 className="game-card-title">{name}</h3>
        <p className="game-card-genre">{genre}</p>
        <p className="game-card-release" style={{ opacity: 0.7 }}>
          {first_release_date ? formatDate(first_release_date * 1000) : ""}
        </p>
        <span className="game-card-rating">
          ⭐ {rating ? Math.round(rating) : "N/A"}
        </span>

        {profile ? (
          <button
            className={saved ? "btn-add" : "btn-remove"}
            onClick={(e) => {
              e.preventDefault(); // verhindert, dass Link geklickt wird
              if (saved) {
                removeGameFromList(profile.id, id);
                showToast(`🗑️ "${name}" entfernt`, "warning");
              } else {
                addGameToList(profile.id, { id, cover, name, genre, rating });
                showToast(`✅ "${name}" gespeichert`, "success");
              }
            }}
          >
            {saved ? (
              <img
                src={remove}
                alt="Entfernen"
                style={{ width: "1rem", height: "1rem" }}
              />
            ) : (
              <img
                src={add}
                alt="Hinzufügen"
                style={{ width: "1rem", height: "1rem" }}
              />
            )}
          </button>
        ) : (
          <button
            className="btn btn-ghost"
            onClick={() =>
              showToast("🔐 Bitte einloggen, um Spiele zu speichern.", "error")
            }
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}

export default GameCard;
