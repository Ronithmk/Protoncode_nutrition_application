import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --bg:        #080c14;
    --bg2:       #0d1220;
    --bg3:       #111827;
    --surface:   #131d2e;
    --surface2:  #1a2640;
    --border:    rgba(255,255,255,0.07);
    --border2:   rgba(255,255,255,0.12);
    --text:      #e8edf5;
    --muted:     #7a8ba3;
    --accent:    #00e5a0;
    --accent2:   #00b8ff;
    --amber:     #f59e0b;
    --rose:      #f43f5e;
    --violet:    #8b5cf6;
    --sidebar-w: 240px;
    --radius:    16px;
    --shadow:    0 8px 32px rgba(0,0,0,0.4);
  }

  .exercise-page { padding: 0; animation: exFadeIn 0.5s ease; }
  @keyframes exFadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

  .ex-header { margin-bottom: 32px; }
  .ex-header h1 {
    font-family: 'Clash Display', sans-serif;
    font-size: 34px; font-weight: 700; letter-spacing: -1px;
    background: linear-gradient(135deg, #e8edf5 0%, #7a8ba3 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    line-height: 1.1;
  }
  .ex-header p { font-size: 14px; color: var(--muted); margin-top: 6px; }

  .ex-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 32px; }
  .ex-stat {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 18px 20px;
    position: relative; overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    animation: cardIn 0.5s ease backwards;
  }
  .ex-stat:nth-child(1) { animation-delay: 0.05s; }
  .ex-stat:nth-child(2) { animation-delay: 0.10s; }
  .ex-stat:nth-child(3) { animation-delay: 0.15s; }
  .ex-stat:nth-child(4) { animation-delay: 0.20s; }
  @keyframes cardIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
  .ex-stat:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
  .ex-stat::before {
    content: ''; position: absolute; top: -30px; right: -30px;
    width: 90px; height: 90px; border-radius: 50%; opacity: 0.07;
  }
  .ex-stat.g::before { background: var(--accent); }
  .ex-stat.b::before { background: var(--accent2); }
  .ex-stat.a::before { background: var(--amber); }
  .ex-stat.r::before { background: var(--rose); }
  .ex-stat-icon { font-size: 22px; margin-bottom: 10px; display: block; }
  .ex-stat-val { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: var(--text); letter-spacing: -1px; line-height: 1; }
  .ex-stat-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-top: 4px; }

  .ex-section-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; }

  .body-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 32px; }
  .body-btn {
    padding: 20px 12px; border-radius: 16px;
    background: var(--surface); border: 1.5px solid var(--border);
    color: var(--muted); font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.25s ease;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    position: relative; overflow: hidden;
  }
  .body-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(0,229,160,0.1), rgba(0,184,255,0.05));
    opacity: 0; transition: opacity 0.25s; border-radius: 14px;
  }
  .body-btn:hover { color: var(--text); border-color: var(--border2); transform: translateY(-4px); }
  .body-btn:hover::before { opacity: 1; }
  .body-btn.active {
    background: rgba(0,229,160,0.08); border-color: var(--accent);
    color: var(--accent); box-shadow: 0 0 24px rgba(0,229,160,0.15); transform: translateY(-4px);
  }
  .body-btn.active::before { opacity: 1; }
  .body-btn-icon { font-size: 30px; transition: transform 0.3s ease; display: block; }
  .body-btn:hover .body-btn-icon, .body-btn.active .body-btn-icon { transform: scale(1.2) rotate(-5deg); }
  .body-btn-label { font-size: 12px; font-weight: 600; }

  .muscle-info-bar {
    display: flex; align-items: center; gap: 16px;
    padding: 14px 20px; background: rgba(0,229,160,0.06);
    border: 1px solid rgba(0,229,160,0.15); border-radius: 12px;
    margin-bottom: 20px; animation: slideDown 0.3s ease;
  }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
  .muscle-info-emoji { font-size: 28px; }
  .muscle-info-name { font-family: 'Clash Display', sans-serif; font-size: 18px; font-weight: 600; color: var(--accent); }
  .muscle-info-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .muscle-info-badge {
    margin-left: auto; font-size: 12px; font-weight: 600;
    padding: 5px 12px; border-radius: 99px;
    background: rgba(0,229,160,0.1); border: 1px solid rgba(0,229,160,0.2); color: var(--accent);
  }

  .exercise-cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; animation: exGridIn 0.35s ease; }
  @keyframes exGridIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

  .exercise-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 18px 20px;
    display: flex; align-items: center; gap: 14px;
    cursor: pointer; transition: all 0.25s ease;
    position: relative; overflow: hidden;
    animation: exCardIn 0.3s ease backwards;
  }
  .exercise-card:nth-child(1) { animation-delay: 0.03s; }
  .exercise-card:nth-child(2) { animation-delay: 0.06s; }
  .exercise-card:nth-child(3) { animation-delay: 0.09s; }
  .exercise-card:nth-child(4) { animation-delay: 0.12s; }
  @keyframes exCardIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
  .exercise-card:hover { border-color: var(--border2); transform: translateX(6px); box-shadow: var(--shadow); }
  .exercise-card.logged { border-color: var(--accent); background: rgba(0,229,160,0.05); }
  .exercise-card::after {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: linear-gradient(180deg, var(--accent), var(--accent2));
    opacity: 0; transition: opacity 0.25s; border-radius: 3px 0 0 3px;
  }
  .exercise-card:hover::after, .exercise-card.logged::after { opacity: 1; }

  .exercise-num {
    width: 36px; height: 36px; border-radius: 10px; background: var(--surface2);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800;
    color: var(--muted); flex-shrink: 0; transition: all 0.2s;
  }
  .exercise-card:hover .exercise-num { background: rgba(0,229,160,0.1); color: var(--accent); }
  .exercise-card.logged .exercise-num { background: rgba(0,229,160,0.15); color: var(--accent); }
  .exercise-info { flex: 1; }
  .exercise-name { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
  .exercise-meta { font-size: 12px; color: var(--muted); }
  .exercise-log-btn {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--surface2); border: 1px solid var(--border2);
    color: var(--muted); font-size: 16px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0;
  }
  .exercise-log-btn:hover { background: rgba(0,229,160,0.1); color: var(--accent); border-color: rgba(0,229,160,0.3); }
  .exercise-card.logged .exercise-log-btn { background: rgba(0,229,160,0.15); color: var(--accent); border-color: rgba(0,229,160,0.3); }

  .logged-section { margin-top: 28px; animation: cardIn 0.4s ease backwards; animation-delay: 0.1s; }
  .logged-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .logged-title { font-family: 'Clash Display', sans-serif; font-size: 18px; font-weight: 600; color: var(--text); }
  .logged-clear {
    font-size: 12px; color: var(--muted); background: none;
    border: 1px solid var(--border); border-radius: 8px; padding: 5px 12px;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .logged-clear:hover { border-color: var(--rose); color: var(--rose); }
  .logged-list { display: flex; flex-direction: column; gap: 8px; }
  .logged-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px; border-radius: 10px;
    background: var(--bg2); border: 1px solid var(--border);
    animation: slideIn 0.3s ease backwards;
  }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
  .logged-dot { width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); flex-shrink: 0; }
  .logged-name { font-size: 14px; font-weight: 500; color: var(--text); flex: 1; }
  .logged-group { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 99px; background: rgba(0,229,160,0.1); color: var(--accent); border: 1px solid rgba(0,229,160,0.2); }
  .logged-time { font-size: 11px; color: var(--muted); }

  .ex-empty { text-align: center; padding: 40px 24px; border: 2px dashed var(--border); border-radius: 16px; color: var(--muted); font-size: 14px; line-height: 1.8; margin-top: 16px; }
  .ex-empty-icon { font-size: 40px; margin-bottom: 12px; display: block; }

  .ex-toast-wrap { position: fixed; top: 24px; right: 24px; z-index: 9999; pointer-events: none; }
  .ex-toast {
    padding: 14px 20px; border-radius: 12px;
    background: var(--surface2); border: 1px solid var(--border2);
    box-shadow: var(--shadow); font-size: 14px; color: var(--text);
    animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards;
  }
  @keyframes toastIn  { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: none; } }
  @keyframes toastOut { to { opacity: 0; transform: translateX(20px); } }

  @media (max-width: 1100px) { .body-grid { grid-template-columns: repeat(3, 1fr); } .ex-stats-row { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 700px)  { .exercise-cards-grid { grid-template-columns: 1fr; } }
  @media (max-width: 480px)  { .body-grid { grid-template-columns: repeat(2, 1fr); } }
`;

const NAV = [
  { to: "/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/diet-goals", icon: "🎯", label: "Diet Goals" },
  { to: "/meals",      icon: "🍽️", label: "Meals" },
  { to: "/recipes",    icon: "📖", label: "Recipes" },
  { to: "/exercise",   icon: "💪", label: "Exercise" },
];

const MUSCLES = {
  Chest:     { icon: "🏋️", color: "#00e5a0", sub: "Pectorals & upper body push",
    moves: [
      { name: "Bench Press",            meta: "3×10 · Compound",   cal: 45 },
      { name: "Push Ups",               meta: "3×20 · Bodyweight", cal: 28 },
      { name: "Incline Dumbbell Press", meta: "3×12 · Compound",   cal: 38 },
      { name: "Chest Fly",              meta: "3×15 · Isolation",  cal: 30 },
      { name: "Cable Crossover",        meta: "3×15 · Isolation",  cal: 32 },
      { name: "Dumbbell Pullover",      meta: "3×12 · Compound",   cal: 35 },
    ]},
  Back:      { icon: "🦾", color: "#00b8ff", sub: "Lats, traps & posterior chain",
    moves: [
      { name: "Pull Ups",      meta: "4×8  · Compound",  cal: 50 },
      { name: "Lat Pulldown",  meta: "3×12 · Compound",  cal: 40 },
      { name: "Seated Row",    meta: "3×12 · Compound",  cal: 38 },
      { name: "Deadlift",      meta: "4×5  · Compound",  cal: 65 },
      { name: "Barbell Row",   meta: "4×8  · Compound",  cal: 52 },
      { name: "Face Pulls",    meta: "3×15 · Isolation",  cal: 25 },
    ]},
  Legs:      { icon: "🦵", color: "#f59e0b", sub: "Quads, hamstrings & glutes",
    moves: [
      { name: "Squats",        meta: "4×8  · Compound",   cal: 70 },
      { name: "Leg Press",     meta: "3×12 · Compound",   cal: 55 },
      { name: "Lunges",        meta: "3×12 · Bodyweight", cal: 45 },
      { name: "Leg Curl",      meta: "3×15 · Isolation",  cal: 30 },
      { name: "Leg Extension", meta: "3×15 · Isolation",  cal: 28 },
      { name: "Calf Raises",   meta: "4×20 · Isolation",  cal: 22 },
    ]},
  Shoulders: { icon: "💪", color: "#8b5cf6", sub: "Deltoids & rotator cuff",
    moves: [
      { name: "Shoulder Press", meta: "4×10 · Compound",  cal: 48 },
      { name: "Lateral Raise",  meta: "3×15 · Isolation",  cal: 28 },
      { name: "Front Raise",    meta: "3×15 · Isolation",  cal: 26 },
      { name: "Arnold Press",   meta: "3×12 · Compound",   cal: 42 },
      { name: "Upright Row",    meta: "3×12 · Compound",   cal: 38 },
      { name: "Reverse Fly",    meta: "3×15 · Isolation",  cal: 24 },
    ]},
  Arms:      { icon: "💪", color: "#f43f5e", sub: "Biceps, triceps & forearms",
    moves: [
      { name: "Bicep Curl",         meta: "3×12 · Isolation",  cal: 25 },
      { name: "Tricep Pushdown",    meta: "3×15 · Isolation",  cal: 28 },
      { name: "Hammer Curl",        meta: "3×12 · Isolation",  cal: 24 },
      { name: "Dips",               meta: "3×12 · Compound",   cal: 38 },
      { name: "Skull Crushers",     meta: "3×12 · Isolation",  cal: 30 },
      { name: "Concentration Curl", meta: "3×12 · Isolation",  cal: 22 },
    ]},
  Abs:       { icon: "🔥", color: "#00e5a0", sub: "Core strength & stability",
    moves: [
      { name: "Crunches",          meta: "3×25 · Bodyweight", cal: 18 },
      { name: "Plank",             meta: "3×60s · Isometric",  cal: 20 },
      { name: "Leg Raises",        meta: "3×20 · Bodyweight", cal: 22 },
      { name: "Russian Twists",    meta: "3×20 · Bodyweight", cal: 25 },
      { name: "Mountain Climbers", meta: "3×30 · Cardio",     cal: 35 },
      { name: "Ab Wheel Rollout",  meta: "3×12 · Advanced",   cal: 30 },
    ]},
};

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

function Exercise() {
  const [selected, setSelected] = useState(null);
  const [logged,   setLogged]   = useState([]);
  const [toast,    setToast]    = useState(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleLog = (moveName, muscleGroup) => {
    const key = `${muscleGroup}::${moveName}`;
    const already = logged.find(l => l.key === key);
    if (already) {
      setLogged(prev => prev.filter(l => l.key !== key));
      showToast(`❌ Removed: ${moveName}`);
    } else {
      const cal = MUSCLES[muscleGroup].moves.find(m => m.name === moveName)?.cal || 0;
      setLogged(prev => [...prev, {
        key, name: moveName, group: muscleGroup, cal,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
      showToast(`✅ Logged: ${moveName} · ~${cal} kcal`);
    }
  };

  const totalCal  = logged.reduce((s, l) => s + l.cal, 0);
  const totalSets = logged.length * 3;

  const stats = [
    { icon: "🔥", val: `${totalCal}`,              label: "Calories Burned",  cls: "g" },
    { icon: "💪", val: `${logged.length}`,          label: "Exercises Logged", cls: "b" },
    { icon: "📋", val: `${totalSets}`,              label: "Total Sets",       cls: "a" },
    { icon: "⏱️", val: `${logged.length * 8}min`,  label: "Est. Duration",    cls: "r" },
  ];

  return (
    <>
      <style>{STYLES}</style>

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
                  <span className="muscle-info-badge">{MUSCLES[selected].moves.length} exercises</span>
                </div>

                <div className="exercise-cards-grid">
                  {MUSCLES[selected].moves.map((ex, i) => {
                    const key = `${selected}::${ex.name}`;
                    const isLogged = logged.some(l => l.key === key);
                    return (
                      <div
                        key={i}
                        className={`exercise-card ${isLogged ? "logged" : ""}`}
                        style={{ animationDelay: `${i * 0.04}s` }}
                      >
                        <div className="exercise-num">{i + 1}</div>
                        <div className="exercise-info">
                          <div className="exercise-name">{ex.name}</div>
                          <div className="exercise-meta">{ex.meta} · 🔥 {ex.cal} kcal</div>
                        </div>
                        <button
                          className="exercise-log-btn"
                          onClick={() => toggleLog(ex.name, selected)}
                          title={isLogged ? "Remove" : "Log this exercise"}
                        >
                          {isLogged ? "✓" : "+"}
                        </button>
                      </div>
                    );
                  })}
                </div>
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
                  <button className="logged-clear" onClick={() => { setLogged([]); showToast("🗑️ Workout cleared"); }}>
                    Clear all
                  </button>
                </div>
                <div className="logged-list">
                  {logged.map((l, i) => (
                    <div key={i} className="logged-item" style={{ animationDelay: `${i * 0.04}s` }}>
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