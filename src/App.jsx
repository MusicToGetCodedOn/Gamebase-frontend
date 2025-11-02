// App.jsx
import { Outlet } from "react-router";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Header from "./components/Header.jsx";
import LoginButton from "./components/LoginButton.jsx";
import Footer from "./components/Footer.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

function AppContent() {
  const { token } = useAuth();

  return (
    <>
      <Header />
      <main>
        {!token ? (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <h2>Bitte melde dich mit Twitch an</h2>
            <LoginButton>Login with Twitch</LoginButton>
          </div>
        ) : (
          <Outlet />
        )}

      </main>
      <Footer />
    </>

  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
// End of App.jsx