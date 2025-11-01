import "./GameCard.css";
import { Link } from "react-router-dom";

function GameCard({ id, cover, name, genre, rating }) {
  return (
    <Link to={`/game/${id}`} className="game-card-link">
      <div className="game-card">
        {cover ? (
          <img src={cover} alt={name} className="game-card-cover" />
        ) : (
          <div className="game-card-placeholder">Kein Bild</div>
        )}

        <div className="game-card-info">
          <h3 className="game-card-title">{name}</h3>
          <p className="game-card-genre">{genre}</p>
          <span className="game-card-rating">
            ⭐ {rating ? Math.round(rating) : "N/A"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default GameCard;
