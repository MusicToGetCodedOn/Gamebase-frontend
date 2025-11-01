import { useNavigate } from "react-router-dom";
import logout from "../assets/icons/logout.png";
import "./LogoutBtn.css";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("twitch_token");
    localStorage.removeItem("twitch_profile_image");
    localStorage.removeItem("twitch_username");
    window.location.reload();
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      <img src={logout} alt="Logout" />
    </button>
  );
}
