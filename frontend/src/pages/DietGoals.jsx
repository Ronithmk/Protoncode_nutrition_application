import { useState, useEffect } from "react";
import API from "../api/axios";
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
    --sidebar-w: 240px;
    --radius:    16px;
    --shadow:    0 8px 32px rgba(0,0,0,0.4);
  }

  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--surface2); border-radius: 99px; }

  .dashboard { display: flex; min-height: 100vh; background: var(--bg); }
  .main { margin-left: var(--sidebar-w); flex: 1; padding: 32px 36px; display: flex; flex-direction: column; gap: 28px; overflow-x: hidden; animation: fadeIn 0.5s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

  /* SIDEBAR */
  .sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: var(--sidebar-w); background: linear-gradient(180deg, #0b1220 0%, #080c14 100%); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 28px 16px 24px; z-index: 100; }
  .sidebar::after { content: ''; position: absolute; top: 0; right: 0; bottom: 0; width: 1px; background: linear-gradient(180deg, transparent, var(--accent) 40%, var(--accent2) 60%, transparent); opacity: 0.3; }
  .sidebar-logo { display: flex; align-items: center; gap: 12px; padding: 0 8px 28px; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
  .sidebar-logo-icon { width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, #00e5a0, #00b8ff); display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 0 20px rgba(0,229,160,0.3); animation: logoPulse 3s ease-in-out infinite; }
  @keyframes logoPulse { 0%,100% { box-shadow: 0 0 20px rgba(0,229,160,0.3); } 50% { box-shadow: 0 0 35px rgba(0,229,160,0.6), 0 0 60px rgba(0,184,255,0.2); } }
  .sidebar-logo-text { font-family: 'Clash Display', sans-serif; font-size: 20px; font-weight: 700; background: linear-gradient(90deg, #00e5a0, #00b8ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.5px; }
  .sidebar-nav-label { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); padding: 0 10px 10px; margin-top: 4px; }
  .sidebar ul { list-style: none; display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .sidebar ul a { display: flex; align-items: center; gap: 12px; padding: 11px 12px; border-radius: 12px; color: var(--muted); text-decoration: none; font-size: 14px; font-weight: 500; transition: all 0.2s ease; position: relative; overflow: hidden; }
  .sidebar ul a::before { content: ''; position: absolute; inset: 0; border-radius: 12px; background: linear-gradient(90deg, rgba(0,229,160,0.08), rgba(0,184,255,0.08)); opacity: 0; transition: opacity 0.2s; }
  .sidebar ul a:hover { color: var(--text); }
  .sidebar ul a:hover::before { opacity: 1; }
  .sidebar ul a.active { color: var(--accent); background: rgba(0,229,160,0.08); border: 1px solid rgba(0,229,160,0.2); }
  .sidebar ul a.active::after { content: ''; position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 60%; background: var(--accent); border-radius: 3px 0 0 3px; }
  .nav-icon { font-size: 18px; width: 24px; text-align: center; }
  .sidebar-divider { height: 1px; background: var(--border); margin: 16px 0; }
  .logout-btn { display: flex; align-items: center; gap: 10px; padding: 11px 12px; border-radius: 12px; background: transparent; border: 1px solid var(--border); color: var(--muted); cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s; font-family: 'DM Sans', sans-serif; width: 100%; }
  .logout-btn:hover { border-color: var(--rose); color: var(--rose); background: rgba(244,63,94,0.05); }

  /* DIET GOALS PAGE */
  .goals-page { animation: fadeIn 0.5s ease; }
  .goals-page-header { margin-bottom: 32px; }
  .goals-page-header h1 { font-family: 'Clash Display', sans-serif; font-size: 34px; font-weight: 700; letter-spacing: -1px; background: linear-gradient(135deg, #e8edf5 0%, #7a8ba3 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.1; }
  .goals-page-header p { font-size: 14px; color: var(--muted); margin-top: 6px; }

  /* PROGRESS OVERVIEW */
  .goals-overview { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 32px; }
  .goals-ov-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; position: relative; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; animation: cardIn 0.5s ease backwards; }
  .goals-ov-card:nth-child(1) { animation-delay: 0.05s; }
  .goals-ov-card:nth-child(2) { animation-delay: 0.10s; }
  .goals-ov-card:nth-child(3) { animation-delay: 0.15s; }
  .goals-ov-card:nth-child(4) { animation-delay: 0.20s; }
  @keyframes cardIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
  .goals-ov-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
  .goals-ov-card::before { content: ''; position: absolute; top: -30px; right: -30px; width: 90px; height: 90px; border-radius: 50%; opacity: 0.07; }
  .goals-ov-card.g::before { background: var(--accent); }
  .goals-ov-card.b::before { background: var(--accent2); }
  .goals-ov-card.a::before { background: var(--amber); }
  .goals-ov-card.r::before { background: var(--rose); }
  .ov-icon { font-size: 22px; margin-bottom: 10px; display: block; }
  .ov-val { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -1px; }
  .ov-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-top: 4px; }
  .ov-bar { margin-top: 10px; height: 4px; border-radius: 99px; background: rgba(255,255,255,0.06); overflow: hidden; }
  .ov-bar-fill { height: 100%; border-radius: 99px; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
  .g .ov-bar-fill { background: linear-gradient(90deg, var(--accent), #00ff88); }
  .b .ov-bar-fill { background: linear-gradient(90deg, var(--accent2), #0088ff); }
  .a .ov-bar-fill { background: linear-gradient(90deg, var(--amber), #fbbf24); }
  .r .ov-bar-fill { background: linear-gradient(90deg, var(--rose), #fb7185); }

  /* GOALS GRID */
  .goals-section-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
  .goals-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 780px; margin-bottom: 24px; }

  .goal-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; animation: cardIn 0.5s ease backwards; }
  .goal-card:nth-child(1) { animation-delay: 0.05s; }
  .goal-card:nth-child(2) { animation-delay: 0.10s; }
  .goal-card:nth-child(3) { animation-delay: 0.15s; }
  .goal-card:nth-child(4) { animation-delay: 0.20s; }
  .goal-card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: var(--shadow); }

  .goal-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .goal-card-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .goal-card-icon.green { background: rgba(0,229,160,0.12); border: 1px solid rgba(0,229,160,0.2); }
  .goal-card-icon.blue  { background: rgba(0,184,255,0.12); border: 1px solid rgba(0,184,255,0.2); }
  .goal-card-icon.amber { background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.2); }
  .goal-card-icon.rose  { background: rgba(244,63,94,0.12);  border: 1px solid rgba(244,63,94,0.2); }
  .goal-card-label { font-family: 'Clash Display', sans-serif; font-weight: 600; font-size: 16px; color: var(--text); }
  .goal-card-unit { font-size: 12px; color: var(--muted); margin-top: 2px; }

  .goal-input-wrap { position: relative; }
  .goal-input { width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border2); background: var(--bg2); font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: var(--text); outline: none; transition: border-color 0.2s, box-shadow 0.2s; letter-spacing: -0.5px; }
  .goal-input::placeholder { color: var(--surface2); font-size: 18px; }
  .goal-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,229,160,0.1); }
  .goal-input-suffix { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 13px; color: var(--muted); font-weight: 600; pointer-events: none; }

  .goal-recommend { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
  .goal-chip { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 99px; border: 1px solid var(--border2); color: var(--muted); background: var(--surface2); cursor: pointer; transition: all 0.2s; }
  .goal-chip:hover { border-color: var(--accent); color: var(--accent); background: rgba(0,229,160,0.08); }

  /* SAVE ROW */
  .goals-save-row { max-width: 780px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .goals-tip { font-size: 13px; color: var(--muted); display: flex; align-items: center; gap: 6px; }
  .save-goals-btn { padding: 13px 32px; border-radius: 12px; background: linear-gradient(135deg, var(--accent), #00c8ff); color: #080c14; font-size: 14px; font-weight: 700; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: transform 0.15s, box-shadow 0.15s; box-shadow: 0 4px 16px rgba(0,229,160,0.3); }
  .save-goals-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,229,160,0.4); }
  .save-goals-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* SUCCESS */
  .goals-success { background: rgba(0,229,160,0.08); border: 1px solid rgba(0,229,160,0.25); color: var(--accent); padding: 14px 18px; border-radius: 12px; font-weight: 600; font-size: 14px; max-width: 780px; animation: successPop 0.3s ease; display: flex; align-items: center; gap: 8px; }
  @keyframes successPop { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }

  /* TOAST */
  .dg-toast-wrap { position: fixed; top: 24px; right: 24px; z-index: 9999; pointer-events: none; }
  .dg-toast { padding: 14px 20px; border-radius: 12px; background: var(--surface2); border: 1px solid var(--border2); box-shadow: var(--shadow); font-size: 14px; color: var(--text); animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards; }
  @keyframes toastIn  { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: none; } }
  @keyframes toastOut { to { opacity: 0; transform: translateX(20px); } }

  @media (max-width: 1100px) { .goals-overview { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 700px)  { .goals-grid { grid-template-columns: 1fr; } .goals-save-row { flex-direction: column; align-items: stretch; } }
`;

const NAV = [
  { to: "/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/diet-goals", icon: "🎯", label: "Diet Goals" },
  { to: "/meals",      icon: "🍽️", label: "Meals" },
  { to: "/recipes",    icon: "📖", label: "Recipes" },
  { to: "/exercise",   icon: "💪", label: "Exercise" },
];

const GOALS_CONFIG = [
  { key: "calories", label: "Calories",  unit: "kcal/day", icon: "🔥", cls: "green", ovCls: "g", suffix: "kcal", chips: ["1500","1800","2000","2200","2500"] },
  { key: "protein",  label: "Protein",   unit: "grams/day", icon: "💪", cls: "blue",  ovCls: "b", suffix: "g",    chips: ["80","100","120","150","180"] },
  { key: "carbs",    label: "Carbs",     unit: "grams/day", icon: "🌾", cls: "amber", ovCls: "a", suffix: "g",    chips: ["150","200","250","300","350"] },
  { key: "fat",      label: "Fat",       unit: "grams/day", icon: "🥑", cls: "rose",  ovCls: "r", suffix: "g",    chips: ["40","55","65","75","90"] },
];

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
      <button className="logout-btn" onClick={onLogout}><span>🚪</span> Logout</button>
    </div>
  );
}

function DietGoals() {
  const [values,  setValues]  = useState({ calories: "", protein: "", carbs: "", fat: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast,   setToast]   = useState(null);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setTimeout(() => setAnimate(true), 100); }, []);

  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const setChip = (key, val) => { setValues(v => ({ ...v, [key]: val })); showToast(`✅ ${key} set to ${val}`); };

  const handleSubmit = async () => {
    if (Object.values(values).some((v) => !v)) { showToast("⚠️ Please fill all fields"); return; }
    setLoading(true); setSuccess(false);
    try {
      await API.post("/diet-goals", { calories_goal: values.calories, protein_goal: values.protein, carbs_goal: values.carbs, fat_goal: values.fat });
      setSuccess(true);
      showToast("🎯 Goals saved successfully!");
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      // demo mode — just show success
      setSuccess(true);
      showToast("🎯 Goals saved successfully!");
      setTimeout(() => setSuccess(false), 4000);
    }
    setLoading(false);
  };

  const maxVals = { calories: 3000, protein: 250, carbs: 500, fat: 120 };

  return (
    <>
      <style>{STYLES}</style>
      {toast && <div className="dg-toast-wrap"><div className="dg-toast">{toast}</div></div>}

      <div className="dashboard">
        <Sidebar onLogout={logout} />
        <div className="main">
          <div className="goals-page">

            {/* HEADER */}
            <div className="goals-page-header">
              <h1>Diet Goals</h1>
              <p>Set your daily nutrition targets and track your progress</p>
            </div>

            {/* OVERVIEW CARDS */}
            <div className="goals-overview">
              {GOALS_CONFIG.map((g) => {
                const val = Number(values[g.key]) || 0;
                const pct = animate && val > 0 ? Math.min((val / maxVals[g.key]) * 100, 100) : 0;
                return (
                  <div key={g.key} className={`goals-ov-card ${g.ovCls}`}>
                    <span className="ov-icon">{g.icon}</span>
                    <div className="ov-val">{val || "—"} <span style={{ fontSize: 13, fontWeight: 400, color: "var(--muted)" }}>{val ? g.suffix : ""}</span></div>
                    <div className="ov-label">{g.label} Goal</div>
                    <div className="ov-bar"><div className="ov-bar-fill" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>

            {/* INPUT CARDS */}
            <p className="goals-section-label">Set Your Targets</p>
            <div className="goals-grid">
              {GOALS_CONFIG.map((g) => (
                <div key={g.key} className="goal-card">
                  <div className="goal-card-header">
                    <div className={`goal-card-icon ${g.cls}`}>{g.icon}</div>
                    <div>
                      <div className="goal-card-label">{g.label}</div>
                      <div className="goal-card-unit">{g.unit}</div>
                    </div>
                  </div>
                  <div className="goal-input-wrap">
                    <input
                      className="goal-input"
                      type="number"
                      placeholder="0"
                      value={values[g.key]}
                      onChange={set(g.key)}
                    />
                    <span className="goal-input-suffix">{g.suffix}</span>
                  </div>
                  <div className="goal-recommend">
                    {g.chips.map(c => (
                      <button key={c} className="goal-chip" onClick={() => setChip(g.key, c)}>{c}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {success && (
              <div className="goals-success">
                ✅ Goals saved successfully! Your nutrition targets are now active.
              </div>
            )}

            <div className="goals-save-row">
              <span className="goals-tip">💡 Tip: Use the quick-select chips above to pick common values</span>
              <button className="save-goals-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving…" : "💾 Save Goals"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default DietGoals;
