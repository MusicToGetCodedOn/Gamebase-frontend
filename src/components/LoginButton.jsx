import { useToast } from "../context/ToastContext.jsx";
import './LoginButton.css';
export default function LoginButton({ children }) {
  const { showToast } = useToast();

  const handleLogin = () => {
    showToast("🔑 Weiterleitung zu Twitch Login...", "info");
    const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;

    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=user:read:email`;

    window.location.href = authUrl;
  };

  return (
    <button className="login-button" onClick={handleLogin}>
      {children}
    </button>
  );
}
