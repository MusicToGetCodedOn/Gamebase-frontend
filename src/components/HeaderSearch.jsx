import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeaderSearch.css";
import searchbar from "../assets/icons/searchbar.png";

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
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/games`, {
          method: "POST",
          headers: {
            "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
            Authorization: `Bearer ${import.meta.env.VITE_TWITCH_APP_TOKEN || ""}`,
            "Content-Type": "text/plain",
          },
          body,
          signal: abort.signal,
        });

        if (!res.ok) {
          setSuggestions([]);
          return;
        }
        const data = await res.json();
        // Filter prefix matches (startsWith) in a case-insensitive way
        const q = debouncedQuery.toLowerCase();
        const filtered = data.filter((g) =>
          g.name && g.name.toLowerCase().startsWith(q)
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

  return (
    <div className={`header-search ${open ? "open" : "closed"}`}>
      <button
        className="search-icon-button"
        aria-label="Open search"
        onClick={() => setOpen((s) => !s)}
      >
        <img src={searchbar} alt="Search" />
      </button>

      <div className="search-panel" role="search">
        <input
          ref={inputRef}
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suche Spiele..."
          aria-label="Spiele suchen"
        />

        {suggestions.length > 0 && (
          <ul className="search-suggestions" role="listbox">
            {suggestions.map((g) => (
              <li
                key={g.id}
                className="search-suggestion"
                role="option"
                onClick={() => handleSelect(g)}
              >
                <img
                  src={g.cover?.url || "/default-cover.png"}
                  alt=""
                  loading="lazy"
                />
                <span>{g.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
