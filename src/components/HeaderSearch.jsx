import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeaderSearch.css";
import searchbar from "../assets/icons/searchbar.png";
import {
  addGameToList,
  removeGameFromList,
  isGameSaved,
} from "../utils/savedLists";
import { useAuth } from "../context/AuthContext";
import add from "../assets/icons/add.png";
import remove from "../assets/icons/remove.png";
import { useToast } from "../context/ToastContext";

// Debounce helper
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { showToast } = useToast();
  

  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    if (!open) return;
    if (debouncedQuery.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    // Fetch suggestions from backend (POST like other fetches in project)
    const abort = new AbortController();
    const fetchSuggestions = async () => {
      try {
        const body = `search \"${debouncedQuery}\"; fields id,name,cover.url,rating; limit 8;`;
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/games`,
          {
            method: "POST",
            headers: {
              "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
              Authorization: `Bearer ${
                import.meta.env.VITE_TWITCH_APP_TOKEN || ""
              }`,
              "Content-Type": "text/plain",
            },
            body,
            signal: abort.signal,
          }
        );

        if (!res.ok) {
          setSuggestions([]);
          return;
        }
        const data = await res.json();
        // Filter prefix matches (startsWith) in a case-insensitive way
        const q = debouncedQuery.toLowerCase();
        const filtered = data.filter(
          (g) => g.name && g.name.toLowerCase().startsWith(q)
        );
        setSuggestions(filtered.slice(0, 6));
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Search error", err);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
    return () => abort.abort();
  }, [debouncedQuery, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleSelect = (game) => {
    setOpen(false);
    setQuery("");
    setSuggestions([]);
    navigate(`/game/${game.id}`);
  };

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".header-search")) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
  return (
    <div className="header-search">
      <button
        className={`search-icon-button ${open ? "active" : ""}`}
        onClick={() => setOpen((s) => !s)}
      >
        <img className="search-icon-button__img" src={searchbar} alt="Search" />
      </button>

      <input
        ref={inputRef}
        className={`search-input ${open ? "expanded" : ""}`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Suche Spiele..."
      />

      {open && suggestions.length > 0 && (
        <ul
          className="search-suggestions"
          role="listbox"
          aria-label="Suchvorschläge"
        >
          {suggestions.map((g) => {
            

            return (
              <li
                key={g.id}
                className="search-suggestion"
                role="option"
                tabIndex={0}
                onClick={(e) => {
                  if (e.target.closest(".suggestion-btn")) return; // verhindert handleSelect bei Button-Klick
                  handleSelect(g);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSelect(g)}
                title={g.name}
              >
                <img
                  className="search-suggestion__img"
                  src={
                    g.cover?.url
                      ? `https:${g.cover.url.replace(
                          "t_thumb",
                          "t_cover_small"
                        )}`
                      : "/default-cover.png"
                  }
                  alt={g.name}
                  loading="lazy"
                />

                <div className="suggestion-text">
                  <span className="suggestion-title">{g.name}</span>
                  {g.rating !== undefined && (
                    <small className="suggestion-meta">
                      ⭐ {Math.round(g.rating)}
                    </small>
                  )}
                </div>

                {profile ? (
                  <button
                    className={
                      profile && isGameSaved(profile.id, g.id)
                        ? "btn btn-ghost suggestion-btn"
                        : "btn btn-primary suggestion-btn"
                    }
                    onClick={() => {
                      if (!profile) return;
                      if (isGameSaved(profile.id, g.id)) {
                        removeGameFromList(profile.id, g.id);
                        showToast(`🗑️ "${g.name}" von deiner Liste entfernt`, "warning");
                        setSuggestions((prev) => [...prev]);
                      } else {
                        addGameToList(profile.id, g);
                        showToast(`✅ "${g.name}" zu deiner Liste hinzugefügt`, "success");
                        setSuggestions((prev) => [...prev]);
                      }
                    }}
                  >
                    {profile && isGameSaved(profile.id, g.id) ? (
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
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
