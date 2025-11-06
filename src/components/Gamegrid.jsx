import GameCard from "./GameCard";
import "./Gamegrid.css";

function GameGrid({ games = [] }) {
console.log(games);

  if (!Array.isArray(games) || games.length === 0) {
    return (
      <p style={{ textAlign: "center", color: "var(--text-color-secondary)" }}>
        Keine Spiele gefunden 😔
      </p>
    );
  }

  return (
    <div className="game-grid">
      {games.map((game) => (
        <GameCard
          key={game.id}
          id={game.id}
          cover={game.cover ? `https:${game.cover.url}` : null}
          name={game.name}
          genre={
            game.genres && game.genres.length > 0
              ? game.genres.map((g) => g.name).join(", ")
              : "Unbekannt"
          }
          rating={game.rating}
          first_release_date={game.first_release_date}
        />
      ))}
    </div>
  );
}

export default GameGrid;
