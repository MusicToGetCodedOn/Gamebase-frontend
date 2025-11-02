// 📁 src/components/GameCarousel.jsx
import React from "react";
import GameCard from "./GameCard";
import "./GameCarousel.css";

function GameCarousel({ games = [], duration = 20 }) {
  if (!games || games.length === 0) return null;

  // Duplizieren für Endlos-Scroll-Effekt
  const items = [...games, ...games];

  const style = {
    ["--carousel-duration"]: `${duration}s`,
  };

  return (
    <div className="game-carousel" style={style} aria-label="Game carousel">
      <div className="carousel-track">
        {items.map((game, idx) => (
          <div className="carousel-item" key={`${game.id}-${idx}`}>
            <GameCard
              id={game.id}
              cover={game.cover?.url?.replace("t_thumb", "t_cover_big")}
              name={game.name}
              genre={game.genres?.[0]?.name || "Unknown"}
              rating={game.rating}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameCarousel;
