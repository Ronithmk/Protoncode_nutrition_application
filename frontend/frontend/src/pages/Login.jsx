import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./auth.css";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true);
    try {
      const res = await API.post("/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🥗</div>
          <span className="auth-logo-text">NutriTrack</span>
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue your journey</p>

        <div className="auth-field">
          <label>Email</label>
          <input className="auth-input" type="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()} />
        </div>
        <div className="auth-field">
          <label>Password</label>
          <input className="auth-input" type="password" placeholder="••••••••"
            value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()} />
        </div>

        {error && <div className="auth-error">⚠ {error}</div>}

        <button className="auth-btn" onClick={login} disabled={loading}>
          {loading ? "Signing in…" : "Sign In →"}
        </button>
        <p className="auth-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Create one</span>
        </p>
      </div>
    </div>
  );
}

export default Login;