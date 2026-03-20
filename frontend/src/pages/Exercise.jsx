import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllExercises } from "../api/exerciseService";
import "./Exercise.css";

const NAV = [
  { to: "/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/diet-goals", icon: "🎯", label: "Diet Goals" },
  { to: "/meals",      icon: "🍽️", label: "Meals" },
  { to: "/recipes",    icon: "📖", label: "Recipes" },
  { to: "/exercise",   icon: "💪", label: "Exercise" },
];

const MUSCLES = {
  Chest:     { icon: "🏋️", color: "#00e5a0", sub: "Pectorals & upper body push",   apiKey: "chest" },
  Back:      { icon: "🦾", color: "#00b8ff", sub: "Lats, traps & posterior chain", apiKey: "back" },
  Legs:      { icon: "🦵", color: "#f59e0b", sub: "Quads, hamstrings & glutes",    apiKey: "upper legs" },
  Shoulders: { icon: "💪", color: "#8b5cf6", sub: "Deltoids & rotator cuff",       apiKey: "shoulders" },
  Arms:      { icon: "💪", color: "#f43f5e", sub: "Biceps, triceps & forearms",    apiKey: "upper arms" },
  Abs:       { icon: "🔥", color: "#00e5a0", sub: "Core strength & stability",     apiKey: "waist" },
};

const CAL_MAP = {
  chest: 38, back: 48, "upper legs": 55,
  shoulders: 38, "upper arms": 28, waist: 25
};

function difficultyColor(level) {
  if (!level) return "#aaa";
  if (level === "beginner") return "#00e5a0";
  if (level === "intermediate") return "#f59e0b";
  return "#f43f5e";
}

// ── GIF component ─────────────────────────────────────────────────────────────
function ExerciseGif({ ex }) {
  const [failed, setFailed] = useState(false);

  const gifUrl = ex?.gifUrl
    ? ex.gifUrl.replace("http://", "https://")
    : null;

  if (failed || !gifUrl) {
    return (
      <div style={{
        width: 110, height: 110, borderRadius: 10, marginTop: 8,
        background: "#1a1a2e",
        border: "1px solid #333",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 32
      }}>
        🏋️
      </div>
    );
  }

  return (
    <img
      src={gifUrl}
      alt={ex.name || "exercise"}
      style={{
        width: "120px",
        height: "110px",
        borderRadius: "10px",
        marginTop: 8,
        objectFit: "cover",
        background: "#1a1a2e"
      }}
      onError={() => setFailed(true)}
    />
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ onLogout }) {
  const { pathname } = useLocation();
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🥗</div>
        <span className="sidebar-logo-text">NutriTrack</span>
      </div>
      <p className="sidebar-nav-label">Menu</p>
      <ul>
        {NAV.map((n) => (
          <li key={n.to}>
            <Link to={n.to} className={pathname === n.to ? "active" : ""}>
              <span className="nav-icon">{n.icon}</span>{n.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="sidebar-divider" />
      <button className="logout-btn" onClick={onLogout}>
        <span>🚪</span> Logout
      </button>
    </div>
  );
}

// ── Main Exercise Page ────────────────────────────────────────────────────────
function Exercise() {
  const [selected,  setSelected]  = useState(null);
  const [logged,    setLogged]    = useState([]);
  const [toast,     setToast]     = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    setExercises([]);

    getAllExercises(MUSCLES[selected].apiKey)
      .then(data => {
        console.log("✅ First exercise:", data[0]);
        console.log("🎬 gifUrl:", data[0]?.gifUrl);
        setExercises(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load exercises.");
        setLoading(false);
      });
  }, [selected]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleLog = (exName, muscleGroup, cal) => {
    const key = `${muscleGroup}::${exName}`;
    const already = logged.find(l => l.key === key);
    if (already) {
      setLogged(prev => prev.filter(l => l.key !== key));
      showToast(`❌ Removed: ${exName}`);
    } else {
      setLogged(prev => [...prev, {
        key, name: exName, group: muscleGroup, cal,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
      showToast(`✅ Logged: ${exName} · ~${cal} kcal`);
    }
  };

  const totalCal  = logged.reduce((s, l) => s + l.cal, 0);
  const totalSets = logged.length * 3;

  const stats = [
    { icon: "🔥", val: `${totalCal}`,             label: "Calories Burned",  cls: "g" },
    { icon: "💪", val: `${logged.length}`,         label: "Exercises Logged", cls: "b" },
    { icon: "📋", val: `${totalSets}`,             label: "Total Sets",       cls: "a" },
    { icon: "⏱️", val: `${logged.length * 8}min`, label: "Est. Duration",    cls: "r" },
  ];

  return (
    <>
      {toast && (
        <div className="ex-toast-wrap">
          <div className="ex-toast">{toast}</div>
        </div>
      )}

      <div className="dashboard">
        <Sidebar onLogout={logout} />
        <div className="main">
          <div className="exercise-page">

            <div className="ex-header">
              <h1>Exercise Tracker</h1>
              <p>Select a muscle group to explore exercises and log your workout</p>
            </div>

            <div className="ex-stats-row">
              {stats.map((s, i) => (
                <div key={i} className={`ex-stat ${s.cls}`}>
                  <span className="ex-stat-icon">{s.icon}</span>
                  <div className="ex-stat-val">{s.val}</div>
                  <div className="ex-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <p className="ex-section-label">Choose Muscle Group</p>
            <div className="body-grid">
              {Object.entries(MUSCLES).map(([part, { icon, color }]) => (
                <button
                  key={part}
                  className={`body-btn ${selected === part ? "active" : ""}`}
                  onClick={() => setSelected(selected === part ? null : part)}
                  style={selected === part ? { borderColor: color, color } : {}}
                >
                  <span className="body-btn-icon">{icon}</span>
                  <span className="body-btn-label">{part}</span>
                </button>
              ))}
            </div>

            {selected && (
              <>
                <div className="muscle-info-bar">
                  <span className="muscle-info-emoji">{MUSCLES[selected].icon}</span>
                  <div>
                    <div className="muscle-info-name">{selected}</div>
                    <div className="muscle-info-sub">{MUSCLES[selected].sub}</div>
                  </div>
                  <span className="muscle-info-badge">
                    {loading ? "Loading..." : `${exercises.length} exercises`}
                  </span>
                </div>

                {loading && (
                  <div className="ex-loading">
                    <div className="ex-loading-spinner" />
                    Loading exercises...
                  </div>
                )}

                {error && <div className="ex-error">⚠️ {error}</div>}

                {!loading && !error && (
                  <div className="exercise-cards-grid">
                    {exercises.slice(0, 20).map((ex, i) => {
                      const key = `${selected}::${ex.name}`;
                      const isLogged = logged.some(l => l.key === key);
                      const cal = CAL_MAP[MUSCLES[selected].apiKey] || 30;
                      return (
                        <div
                          key={ex.id || i}
                          className={`exercise-card ${isLogged ? "logged" : ""}`}
                          style={{ animationDelay: `${i * 0.04}s` }}
                        >
                          <div className="exercise-num">{i + 1}</div>
                          <div className="exercise-info">
                            <div
                              className="exercise-name"
                              style={{ color: "#ffffff", textTransform: "capitalize" }}
                            >
                              {ex.name}
                            </div>
                            <div
                              className="exercise-meta"
                              style={{ color: "#aaaaaa", textTransform: "capitalize" }}
                            >
                              {ex.target} · {ex.equipment}
                            </div>
                            {ex.difficulty && (
                              <span style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: difficultyColor(ex.difficulty),
                                textTransform: "capitalize",
                                marginTop: 2,
                                display: "inline-block"
                              }}>
                                ● {ex.difficulty}
                              </span>
                            )}
                            <ExerciseGif ex={ex} />
                          </div>
                          <button
                            className="exercise-log-btn"
                            onClick={() => toggleLog(ex.name, selected, cal)}
                            title={isLogged ? "Remove" : "Log this exercise"}
                          >
                            {isLogged ? "✓" : "+"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {!selected && (
              <div className="ex-empty">
                <span className="ex-empty-icon">💪</span>
                Select a muscle group above to see exercises<br />
                <span style={{ fontSize: 12, marginTop: 4, display: "block" }}>
                  Click any card to log it to today's workout
                </span>
              </div>
            )}

            {logged.length > 0 && (
              <div className="logged-section">
                <div className="logged-header">
                  <span className="logged-title">Today's Workout Log</span>
                  <button
                    className="logged-clear"
                    onClick={() => { setLogged([]); showToast("🗑️ Workout cleared"); }}
                  >
                    Clear all
                  </button>
                </div>
                <div className="logged-list">
                  {logged.map((l, i) => (
                    <div
                      key={i}
                      className="logged-item"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      <div className="logged-dot" />
                      <span className="logged-name">{l.name}</span>
                      <span className="logged-group">{l.group}</span>
                      <span className="logged-time">🔥 {l.cal} kcal · {l.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

export default Exercise;