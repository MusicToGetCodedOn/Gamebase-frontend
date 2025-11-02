import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";
import HeaderSearch from "./HeaderSearch";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";
import login from "../assets/icons/login.png";
import LoginNav from "./LoginNav";

export default function Header() {
  const { token, profile } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false); // Menü schließen nach Navigation
  };

  return (
    <header className="header">
      {/* Hamburger Icon - nur auf Mobile sichtbar */}
      <button
        className="hamburger"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
      </button>

      {/* Mobile Menü - nur Navigation Links */}
      <nav className={`nav-container ${menuOpen ? "open" : ""}`}>
        <div className="nav-left">
          <button
            className="container-item"
            onClick={() => handleNavigate("/")}
          >
            Home
          </button>
          <button
            className="container-item"
            onClick={() => handleNavigate("/discover")}
          >
            Discover
          </button>
          <button
            className="container-item"
            onClick={() => handleNavigate("/popular")}
          >
            Trending
          </button>
          <button
            className="container-item"
            onClick={() => handleNavigate("/top-rated")}
          >
            Top Rated
          </button>
          <button
            className="container-item"
            onClick={() => handleNavigate("/upcoming")}
          >
            Upcoming
          </button>
        </div>
      </nav>

      {/* nav-right bleibt immer oben rechts sichtbar */}
      <div className="nav-right">
        <HeaderSearch />
        <ThemeToggle />
        {!token ? (
         <LoginNav><img src={login} alt="" /></LoginNav>
        ) : (
          <div className="auth-buttons">
            <button
              className="profile-avatar"
              onClick={() => handleNavigate("/profile")}
            >
              <img
                src={profile?.profile_image_url || "/default-avatar.png"}
                alt={profile?.display_name || "Profilbild"}
              />
            </button>
            <LogoutButton />
          </div>
        )}
      </div>
    </header>
  );
}
