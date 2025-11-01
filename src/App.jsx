// App.jsx
import { Outlet } from "react-router";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Header from "./components/Header.jsx";
import LoginButton from "./components/LoginButton.jsx";

function AppContent() {
  const { token } = useAuth();

  return (
    <>
      <Header />
      <main>
        {!token ? (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <h2>Bitte melde dich mit Twitch an</h2>
            <LoginButton />
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
// End of App.jsx