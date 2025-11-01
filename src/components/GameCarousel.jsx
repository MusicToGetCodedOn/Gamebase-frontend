import React, { useEffect, useState } from "react";
import GameCard from "./GameCard";
import "./GameCarousel.css";
import { fetchGames } from "../utils/fetchgames";


function GameCarousel({ duration = 10 }) {
    const [games, setGames] = useState([]);

    useEffect(() => {
        async function loadGames() {
            const fetchedGames = await fetchGames(10, 0);
            setGames(fetchedGames);
        }
        loadGames();
    }, []);

    if (!games || games.length === 0) return null;

  // Duplicate the items to create a seamless loop
  const items = [...games, ...games];

  const style = {
    // CSS variable used by the stylesheet to set animation duration
    ["--carousel-duration"]: `${duration}s`,
  };
  
  

  return (
    <div className="game-carousel" style={style} aria-label="Game carousel">
      <div className="carousel-track">
        {items.map((game, idx) => (
          <div className="carousel-item" key={`${game.id}-${idx}`}>
            <GameCard
              id={game.id}
              cover={game.cover?.url.replace('t_thumb', 't_cover_small')}
              name={game.name}
              genre={game.genre}
              rating={game.rating}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameCarousel;
