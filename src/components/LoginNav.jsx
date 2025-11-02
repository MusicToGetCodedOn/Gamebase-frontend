import './LoginNav.css';
import { useToast } from "../context/ToastContext.jsx";

export default function LoginNav({ children }) {
    const { showToast } = useToast(); 
    const handleLogin = () => {
        showToast("🔑 Weiterleitung zu Twitch Login...", "info");
    const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;

    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=user:read:email`;

    window.location.href = authUrl;
  };

  return (
    <button className="login-nav" onClick={handleLogin}>
      {children}
    </button>
  );
}