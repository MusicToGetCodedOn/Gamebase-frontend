import { useNavigate } from "react-router-dom";
import logout from "../assets/logout.svg";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🔹 Alles aus localStorage entfernen
    localStorage.removeItem("twitch_token");
    localStorage.removeItem("twitch_profile_image");
    localStorage.removeItem("twitch_username");

    // 🔹 Optional: Twitch OAuth Session beenden (nicht zwingend nötig)
    // window.open("https://id.twitch.tv/logout", "_blank");

    // 🔹 State erzwingen (React Hook wird beim nächsten Render sehen, dass kein Token mehr da ist)
    window.location.reload(); // einfache & saubere Lösung

    // Alternativ, falls du lieber SPA bleiben willst:
    // navigate("/");
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      <img src={logout} alt="Logout" />
    </button>
  );
}
