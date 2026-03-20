import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./auth.css";

function Register() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const register = async () => {
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(""); setLoading(true);
    try {
      await API.post("/register", { name, email, password });
      navigate("/");
    } catch {
      setError("Registration failed. Email may already be in use.");
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
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start tracking your nutrition today</p>

        <div className="auth-field">
          <label>Full Name</label>
          <input className="auth-input" placeholder="Jane Doe"
            value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="auth-field">
          <label>Email</label>
          <input className="auth-input" type="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="auth-field">
          <label>Password</label>
          <input className="auth-input" type="password" placeholder="Min. 6 characters"
            value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && register()} />
        </div>

        {error && <div className="auth-error">⚠ {error}</div>}

        <button className="auth-btn" onClick={register} disabled={loading}>
          {loading ? "Creating account…" : "Create Account →"}
        </button>
        <p className="auth-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

export default Register;