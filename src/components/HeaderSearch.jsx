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
                <ul className="search-suggestions" role="listbox" aria-label="Suchvorschläge">
                    {suggestions.map((g) => (
                        <li
                            key={g.id}
                            className="search-suggestion"
                            role="option"
                            tabIndex={0}
                            onClick={() => handleSelect(g)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSelect(g);
                            }}
                            title={g.name}
                        >
                            <img
                                className="search-suggestion__img"
                                src={
                                    g.cover?.url
                                        ? `https:${g.cover.url.replace("t_thumb", "t_cover_small")}`
                                        : "/default-cover.png"
                                }
                                alt={g.name}
                                loading="lazy"
                            />
                            <div className="suggestion-text">
                                <span className="suggestion-title">{g.name}</span>
                                {g.rating !== undefined && (
                                    <small className="suggestion-meta">⭐ {Math.round(g.rating)}</small>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>

    );
}
