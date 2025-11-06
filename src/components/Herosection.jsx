import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Herosection.css";
import {
  addGameToList,
  removeGameFromList,
  isGameSaved,
} from "../utils/savedLists";
import { useAuth } from "../context/AuthContext";
import add from "../assets/icons/add.png";
import remove from "../assets/icons/remove.png";
import { useToast } from "../context/ToastContext";

function Herosection() {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchRandomTopGames() {
      try {
        setLoading(true);

        // Bessere IGDB Query:
        const res = await fetch(`${VITE_API_BASE_URL}/api/games`, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: `
  fields name, cover.url, rating, genres.name, involved_companies.company.name, involved_companies.publisher, total_rating_count;
  where rating >= 80 & total_rating_count > 20 & cover != null;
  sort total_rating_count desc;
  limit 30;
`,
        });

        if (!res.ok) throw new Error("Fehler beim Laden der Spiele");
        const data = await res.json();

        // 4 zufällige Spiele auswählen
        if (Array.isArray(data) && data.length > 0) {
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          setSlides(shuffled.slice(0, 4));
        } else {
          console.warn("⚠️ Keine passenden Spiele gefunden.");
        }
      } catch (err) {
        console.error("❌ Fehler beim Laden der Hero Games:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRandomTopGames();
  }, []);

  // Auto-Slider
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const formatDate = (unix) => {
    if (!unix) return "Unbekanntes Datum";
    const date = new Date(unix * 1000);
    return date.toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <section className="hero-section loading">
        <p>🎮 Lade Top Games...</p>
      </section>
    );

  if (slides.length === 0)
    return (
      <section className="hero-section empty">
        <p>Keine Spiele gefunden 😔</p>
      </section>
    );

  return (
    <section className="hero-section">
      <div className="hero-slider">
        {slides.map((game, index) => {
          const saved = profile ? isGameSaved(profile.id, game.id) : false;
          const bgImage = game.cover
            ? `https:${game.cover.url.replace("t_thumb", "t_1080p")}`
            : "/placeholder-cover.jpg";
          const publisher =
            game.involved_companies?.find((c) => c.publisher)?.company?.name ||
            "Unbekannter Publisher";

          return (
            <div
              key={`${game.id}-${index}`}
              className={`hero-slide ${index === currentSlide ? "active" : ""}`}
              style={{
                backgroundImage: `url(${bgImage})`,
              }}
            >
              <div className="hero-overlay"></div>
              <div className="hero-content">
                <span className="hero-rating">
                  ⭐ {Math.round(game.rating)} |{" "}
                  {game.genres?.[0]?.name || "Genre unbekannt"}
                </span>
                <h1 className="hero-title">{game.name}</h1>
                <p className="hero-description">
                  <span className="hero-buttons">{publisher}</span>
                </p>
                <div className="hero-buttons">
                  <Link to={`/game/${game.id}`} className="hero-btn secondary">
                    Mehr erfahren
                  </Link>
                  {profile ? (
                    <button
                      className={
                        profile && isGameSaved(profile.id, game.id)
                          ? "hero-btn secondary"
                          : "hero-btn primary"
                      }
                      onClick={() => {
                        if (!profile) return;
                        if (isGameSaved(profile.id, game.id)) {
                          removeGameFromList(profile.id, game.id);
                          showToast(
                            `🗑️ "${game.name}" von deiner Liste entfernt`,
                            "warning"
                          );
                          setSuggestions((prev) => [...prev]);
                        } else {
                          addGameToList(profile.id, game);
                          showToast(
                            `✅ "${game.name}" zu deiner Liste hinzugefügt`,
                            "success"
                          );
                          setSuggestions((prev) => [...prev]);
                        }
                      }}
                    >
                      {profile && isGameSaved(profile.id, game.id) ? (
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
                      className="btn btn-ghost suggestion-btn"
                      onClick={() =>
                        alert("Bitte einloggen, um Spiele zu speichern.")
                      }
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation arrows */}
      <button className="hero-arrow hero-arrow-left" onClick={prevSlide}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button className="hero-arrow hero-arrow-right" onClick={nextSlide}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Dots */}
      <div className="hero-dots">
        {slides.map((game, index) => (
          <button
            key={`dot-${game.id}-${index}`}
            className={`hero-dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default Herosection;
