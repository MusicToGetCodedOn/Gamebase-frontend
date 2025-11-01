// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  // 1️⃣ Token aus URL lesen (nach Twitch-Login)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");

      if (accessToken) {
        localStorage.setItem("twitch_token", accessToken);
        setToken(accessToken);

        // URL bereinigen
        window.history.replaceState({}, document.title, "/");
      }
    } else {
      const savedToken = localStorage.getItem("twitch_token");
      if (savedToken) setToken(savedToken);
    }
  }, []);

  // 2️⃣ Twitch-Profil laden
  useEffect(() => {
    if (!token) return;

    async function fetchProfile() {
      try {
        const res = await fetch("https://api.twitch.tv/helix/users", {
          headers: {
            "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.data && data.data.length > 0) {
          setProfile(data.data[0]);
        } else {
          console.warn("❌ Kein Userobjekt:", data);
        }
      } catch (err) {
        console.error("Fehler beim Laden des Profils:", err);
      }
    }

    fetchProfile();
  }, [token]);

  // 3️⃣ Logout
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setProfile(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ token, profile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
