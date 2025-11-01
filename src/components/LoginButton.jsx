// src/components/LoginButton.jsx
export default function LoginButton() {
  const handleLogin = () => {
    const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;

    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=user:read:email`;

    window.location.href = authUrl;
  };

  return (
    <button className="login-button" onClick={handleLogin}>
      Login with Twitch
    </button>
  );
}
