import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [mode,     setMode]     = useState("user");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const navigate = useNavigate();

  const handleTabSwitch = (tab) => {
    setMode(tab);
    setError("");
    setEmail("");
    setPassword("");
    setAdminKey("");
  };

  // ── Clears all auth data before setting new session ───────────────────────
  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  };

  // ── User login ─────────────────────────────────────────────────────────────
  const loginUser = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/login", { email, password });

      clearAuth();
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role",  "user");
      localStorage.setItem("user",  JSON.stringify(res.data.user ?? { email }));

      navigate("/dashboard");
    } catch (err) {
      console.error("User login error:", err.response ?? err);
      setError(
        err.response?.data?.detail ||
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Admin login ────────────────────────────────────────────────────────────
  const loginAdmin = async () => {
    if (!email || !password || !adminKey) {
      setError("Please fill in all fields including the admin key.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/admin/login", {
        email,
        password,
        admin_key: adminKey,
      });

      clearAuth();
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role",  "admin");
      localStorage.setItem("user",  JSON.stringify(res.data.user ?? { email }));

      navigate("/admin");
    } catch (err) {
      console.error("Admin login error:", err.response ?? err);
      setError(
        err.response?.data?.detail ||
        "Invalid admin credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => (mode === "admin" ? loginAdmin() : loginUser());
  const handleEnter  = (e) => e.key === "Enter" && handleSubmit();

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🥗</div>
          <span className="auth-logo-text">NutriTrack</span>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "user" ? "active" : ""}`}
            onClick={() => handleTabSwitch("user")}
          >
            👤 User
          </button>
          <button
            className={`auth-tab auth-tab--admin ${mode === "admin" ? "active" : ""}`}
            onClick={() => handleTabSwitch("admin")}
          >
            🛡️ Admin
          </button>
        </div>

        <h1 className="auth-title">
          {mode === "admin" ? "Admin Portal" : "Welcome back"}
        </h1>
        <p className="auth-subtitle">
          {mode === "admin"
            ? "Sign in to manage content & media"
            : "Sign in to continue your journey"}
        </p>

        {/* Email */}
        <div className="auth-field">
          <label>EMAIL</label>
          <input
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleEnter}
          />
        </div>

        {/* Password */}
        <div className="auth-field">
          <label>PASSWORD</label>
          <input
            className="auth-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleEnter}
          />
        </div>

        {/* Admin secret key */}
        {mode === "admin" && (
          <div className="auth-field">
            <label>ADMIN SECRET KEY</label>
            <input
              className="auth-input auth-input--admin"
              type="password"
              placeholder="Enter secret admin key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={handleEnter}
            />
          </div>
        )}

        {/* Error message */}
        {error && <div className="auth-error">⚠ {error}</div>}

        {/* Submit button */}
        <button
          className={`auth-btn ${mode === "admin" ? "auth-btn--admin" : ""}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Signing in…"
            : mode === "admin"
            ? "Enter Admin Panel →"
            : "Sign In →"}
        </button>

        {/* Footer links */}
        {mode === "user" && (
          <p className="auth-link">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>Create one</span>
          </p>
        )}

        {mode === "admin" && (
          <p className="auth-link auth-link--admin">
            🔒 Restricted access. Contact your system administrator.
          </p>
        )}

      </div>
    </div>
  );
}

export default Login;