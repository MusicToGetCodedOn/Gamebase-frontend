import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

function AccountRoute() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const { token, profile, logout } = useAuth();

  const navigate = useNavigate();
  if (!token) return <p>Du bist nicht eingeloggt.</p>;
  if (!profile) return <p>Profil wird geladen...</p>;


  if (!token) {
    return <p>Du bist nicht eingeloggt.</p>;
  }

  if (!profile) {
    return <p>Profil wird  geladen...</p>;
  }

  return (
    <main>
      <div style={{ textAlign: "center", color: "var(--text-color)" }}>
        <img
          src={profile.profile_image_url}
          alt={profile.display_name}
          style={{ borderRadius: "50%", width: "100px", height: "100px" }}
        />
        <h2>{profile.display_name}</h2>
        <p>@{profile.login}</p>
      </div>
      <div style={{ textAlign: "center", marginTop: "1rem", marginBottom: "100vh" }}>
        
      </div>
    </main>
  );
}

export default AccountRoute;
