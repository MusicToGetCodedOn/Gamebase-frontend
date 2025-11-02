import React, { useState } from "react";
import "./FilterModal.css";

export default function FilterModal({ open, onClose, onApply }) {
  const [filters, setFilters] = useState({
    genre: "",
    platform: "",
    sort: "rating desc",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="filter-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Filter Games</h3>

        <div className="filter-group">
          <label>Genre</label>
          <select name="genre" value={filters.genre} onChange={handleChange}>
            <option value="">Alle</option>
            <option value="Shooter">Shooter</option>
            <option value="RPG">RPG</option>
            <option value="Adventure">Adventure</option>
            <option value="Simulation">Simulation</option>
            <option value="Strategy">Strategy</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Plattform</label>
          <select name="platform" value={filters.platform} onChange={handleChange}>
            <option value="">Alle</option>
            <option value="PC">PC</option>
            <option value="PlayStation 5">PlayStation 5</option>
            <option value="Xbox Series X|S">Xbox Series X|S</option>
            <option value="Nintendo Switch">Nintendo Switch</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sortieren nach</label>
          <select name="sort" value={filters.sort} onChange={handleChange}>
            <option value="rating desc">Bewertung (absteigend)</option>
            <option value="first_release_date desc">Release (neueste zuerst)</option>
            <option value="name asc">Name (A-Z)</option>
          </select>
        </div>

        <div className="filter-actions">
          <button onClick={handleApply}>Übernehmen</button>
          <button onClick={onClose} className="cancel">Abbrechen</button>
        </div>
      </div>
    </div>
  );
}
