import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// No hardcoded colors — all styles use CSS variables set by ThemeContext
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--surface2, #1a2640); border-radius: 99px; }

  /* ── LAYOUT ── */
  .dashboard { display: flex; min-height: 100vh; background: var(--bg); }
  .main { margin-left: var(--sidebar-w, 240px); flex: 1; padding: 32px 36px; animation: fadeIn 0.5s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

  /* ── SIDEBAR ── */
  .sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: var(--sidebar-w, 240px); background: var(--bg2); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 28px 16px 24px; z-index: 100; }
  .sidebar-glow { position: absolute; top: 0; right: 0; bottom: 0; width: 1px; background: linear-gradient(180deg, transparent, var(--accent) 40%, var(--accent2, var(--accent)) 60%, transparent); opacity: 0.3; pointer-events: none; }
  .sidebar-logo { display: flex; align-items: center; gap: 12px; padding: 0 8px 28px; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
  .sidebar-logo-icon { width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, var(--accent), var(--accent2, var(--accent))); display: flex; align-items: center; justify-content: center; font-size: 20px; animation: logoPulse 3s ease-in-out infinite; }
  @keyframes logoPulse { 0%,100% { box-shadow: 0 0 20px rgba(0,0,0,0.2); } 50% { box-shadow: 0 0 35px rgba(0,0,0,0.1); } }
  .sidebar-logo-text { font-family: 'Clash Display', sans-serif; font-size: 20px; font-weight: 700; color: var(--accent); letter-spacing: -0.5px; }
  .sidebar-nav-label { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); padding: 0 10px 10px; }
  .sidebar ul { list-style: none; display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .sidebar ul a { display: flex; align-items: center; gap: 12px; padding: 11px 12px; border-radius: 12px; color: var(--muted); text-decoration: none; font-size: 14px; font-weight: 500; transition: all 0.2s; position: relative; }
  .sidebar ul a:hover { color: var(--text); background: var(--surface, var(--bg3)); }
  .sidebar ul a.active { color: var(--accent); background: var(--surface, var(--bg3)); border: 1px solid var(--border); }
  .sidebar ul a.active::after { content: ''; position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 60%; background: var(--accent); border-radius: 3px 0 0 3px; }
  .nav-icon { font-size: 18px; width: 24px; text-align: center; }
  .sidebar-divider { height: 1px; background: var(--border); margin: 16px 0; }
  .logout-btn { display: flex; align-items: center; gap: 10px; padding: 11px 12px; border-radius: 12px; background: transparent; border: 1px solid var(--border); color: var(--muted); cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s; font-family: 'DM Sans', sans-serif; width: 100%; }
  .logout-btn:hover { border-color: var(--rose); color: var(--rose); background: rgba(244,63,94,0.05); }

  /* ── PAGE HEADER ── */
  .meals-header { margin-bottom: 32px; }
  .meals-header h1 { font-family: 'Clash Display', sans-serif; font-size: 34px; font-weight: 700; letter-spacing: -1px; color: var(--text); line-height: 1.1; }
  .meals-header p { font-size: 14px; color: var(--muted); margin-top: 6px; }

  /* ── MACRO OVERVIEW ── */
  .macro-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 32px; }
  .macro-card { background: var(--surface, var(--bg2)); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; position: relative; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; animation: cardIn 0.5s ease backwards; }
  .macro-card:nth-child(1){animation-delay:0.05s} .macro-card:nth-child(2){animation-delay:0.10s} .macro-card:nth-child(3){animation-delay:0.15s} .macro-card:nth-child(4){animation-delay:0.20s}
  @keyframes cardIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
  .macro-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
  .macro-icon { font-size: 22px; margin-bottom: 10px; display: block; }
  .macro-val { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -1px; }
  .macro-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-top: 4px; }
  .macro-bar { margin-top: 10px; height: 4px; border-radius: 99px; background: var(--border); overflow: hidden; }
  .macro-bar-fill { height: 100%; border-radius: 99px; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }

  /* ── ADD MEAL CARD ── */
  .section-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; }
  .add-card { background: var(--surface, var(--bg2)); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 24px; animation: cardIn 0.4s ease backwards; animation-delay: 0.1s; }
  .add-card-title { font-family: 'Clash Display', sans-serif; font-size: 18px; font-weight: 600; color: var(--text); margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
  .meal-form-row { display: grid; grid-template-columns: 160px 1fr 130px auto; gap: 12px; align-items: end; }
  .meal-form-field { display: flex; flex-direction: column; gap: 6px; }
  .meal-form-field label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--muted); }
  .meal-input, .meal-select { width: 100%; padding: 11px 14px; background: var(--bg, #fff); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .meal-input::placeholder { color: var(--muted); }
  .meal-input:focus, .meal-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,0,0,0.05); }
  .meal-select { cursor: pointer; }
  .add-btn { padding: 11px 24px; border-radius: 10px; background: var(--accent); color: var(--bg, #fff); font-size: 14px; font-weight: 700; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: transform 0.15s, opacity 0.15s; white-space: nowrap; }
  .add-btn:hover { transform: translateY(-2px); opacity: 0.9; }
  .add-btn:active { transform: scale(0.97); }

  /* ── MEAL TYPE TABS ── */
  .type-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .type-tab { padding: 7px 16px; border-radius: 99px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 6px; }
  .type-tab:hover { border-color: var(--accent); color: var(--accent); }
  .type-tab.active-tab { background: var(--accent); color: var(--bg, #fff); border-color: var(--accent); }
  .type-tab-count { font-size: 11px; background: rgba(0,0,0,0.15); border-radius: 99px; padding: 1px 6px; }
  .type-tab.active-tab .type-tab-count { background: rgba(0,0,0,0.2); }

  /* ── MEAL GROUPS ── */
  .meals-list { display: flex; flex-direction: column; gap: 24px; }
  .meal-group { animation: cardIn 0.4s ease backwards; }
  .meal-group-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .meal-group-icon { font-size: 20px; }
  .meal-group-label { font-family: 'Clash Display', sans-serif; font-size: 16px; font-weight: 600; color: var(--text); }
  .meal-group-count { font-size: 12px; padding: 3px 10px; border-radius: 99px; background: var(--surface, var(--bg3)); border: 1px solid var(--border); color: var(--muted); }
  .meal-items { display: flex; flex-direction: column; gap: 8px; }
  .meal-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: 12px; background: var(--surface, var(--bg2)); border: 1px solid var(--border); transition: all 0.2s; animation: slideIn 0.3s ease backwards; }
  .meal-item:hover { border-color: var(--border2, var(--accent)); transform: translateX(4px); }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
  .meal-item-left { display: flex; align-items: center; gap: 12px; }
  .meal-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .meal-item-info {}
  .meal-item-name { font-size: 14px; font-weight: 600; color: var(--text); }
  .meal-item-time { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .meal-item-right { display: flex; align-items: center; gap: 10px; }
  .meal-cal-tag { font-size: 12px; color: var(--muted); }
  .meal-protein-tag { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 99px; background: var(--surface, var(--bg3)); border: 1px solid var(--border); color: var(--accent); }
  .meal-delete { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 14px; padding: 4px 6px; border-radius: 6px; transition: all 0.2s; }
  .meal-delete:hover { color: var(--rose); background: rgba(244,63,94,0.1); }

  /* ── EMPTY STATE ── */
  .empty-state { text-align: center; padding: 48px 24px; border: 2px dashed var(--border); border-radius: 16px; color: var(--muted); animation: cardIn 0.4s ease; }
  .empty-icon { font-size: 48px; margin-bottom: 12px; display: block; }
  .empty-title { font-family: 'Clash Display', sans-serif; font-size: 18px; font-weight: 600; color: var(--text); margin-bottom: 8px; }
  .empty-sub { font-size: 14px; line-height: 1.6; }

  /* ── SUMMARY BANNER ── */
  .summary-banner { margin-top: 28px; padding: 20px 24px; border-radius: 16px; background: var(--surface, var(--bg2)); border: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; animation: cardIn 0.5s ease backwards; }
  .summary-stats { display: flex; gap: 32px; flex-wrap: wrap; }
  .summary-stat-val { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: var(--accent); letter-spacing: -1px; }
  .summary-stat-label { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .summary-emoji { font-size: 40px; }

  /* ── TOAST ── */
  .toast-wrap { position: fixed; top: 24px; right: 24px; z-index: 9999; pointer-events: none; }
  .toast { padding: 14px 20px; border-radius: 12px; background: var(--surface, var(--bg2)); border: 1px solid var(--border); box-shadow: 0 8px 32px rgba(0,0,0,0.2); font-size: 14px; color: var(--text); animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards; }
  @keyframes toastIn  { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: none; } }
  @keyframes toastOut { to   { opacity: 0; transform: translateX(20px); } }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) { .macro-row { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 700px) { .meal-form-row { grid-template-columns: 1fr 1fr; } .add-btn { grid-column: span 2; } }
  @media (max-width: 480px) { .macro-row { grid-template-columns: 1fr 1fr; } .meal-form-row { grid-template-columns: 1fr; } .add-btn { grid-column: auto; } }
`;

const NAV = [
  { to: "/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/diet-goals", icon: "🎯", label: "Diet Goals" },
  { to: "/meals",      icon: "🍽️", label: "Meals" },
  { to: "/recipes",    icon: "📖", label: "Recipes" },
  { to: "/exercise",   icon: "💪", label: "Exercise" },
];

const MEAL_TYPES = [
  { label: "Breakfast", icon: "🌅" },
  { label: "Lunch",     icon: "☀️" },
  { label: "Dinner",    icon: "🌙" },
  { label: "Snacks",    icon: "🍎" },
];

const MACROS = [
  { key: "calories", label: "Calories",  icon: "🔥", suffix: "kcal", color: "#00e5a0", max: 2200 },
  { key: "protein",  label: "Protein",   icon: "💪", suffix: "g",    color: "#00b8ff", max: 150  },
  { key: "carbs",    label: "Carbs",     icon: "🌾", suffix: "g",    color: "#f59e0b", max: 250  },
  { key: "fat",      label: "Fat",       icon: "🥑", suffix: "g",    color: "#f43f5e", max: 70   },
];

function Sidebar({ onLogout }) {
  const { pathname } = useLocation();
  return (
    <div className="sidebar">
      <div className="sidebar-glow" />
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

export default function Meals() {
  const navigate  = useNavigate();
  const [type,    setType]    = useState("Breakfast");
  const [food,    setFood]    = useState("");
  const [protein, setProtein] = useState("");
  const [calories,setCalories]= useState("");
  const [carbs,   setCarbs]   = useState("");
  const [fat,     setFat]     = useState("");
  const [meals,   setMeals]   = useState([]);
  const [filter,  setFilter]  = useState("All");
  const [toast,   setToast]   = useState(null);
  const [animate, setAnimate] = useState(false);

  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // animate bars after mount
  setTimeout(() => setAnimate(true), 150);

  const addMeal = () => {
    if (!food || !protein) { showToast("⚠️ Please enter food name and protein"); return; }
    const newMeal = {
      type, food,
      protein:  Number(protein)  || 0,
      calories: Number(calories) || 0,
      carbs:    Number(carbs)    || 0,
      fat:      Number(fat)      || 0,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMeals(prev => [newMeal, ...prev]);
    setFood(""); setProtein(""); setCalories(""); setCarbs(""); setFat("");
    showToast(`✅ ${food} added to ${type}!`);
  };

  const deleteMeal = (i) => { setMeals(prev => prev.filter((_, idx) => idx !== i)); showToast("🗑️ Meal removed"); };

  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + m.calories,
    protein:  acc.protein  + m.protein,
    carbs:    acc.carbs    + m.carbs,
    fat:      acc.fat      + m.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const filtered = filter === "All" ? meals : meals.filter(m => m.type === filter);

  const grouped = MEAL_TYPES.reduce((acc, t) => {
    const items = filtered.filter(m => m.type === t.label);
    if (items.length) acc.push({ ...t, items });
    return acc;
  }, []);

  const countFor = (label) => meals.filter(m => m.type === label).length;

  return (
    <>
      <style>{STYLES}</style>
      {toast && <div className="toast-wrap"><div className="toast">{toast}</div></div>}

      <div className="dashboard">
        <Sidebar onLogout={logout} />
        <div className="main">

          {/* HEADER */}
          <div className="meals-header">
            <h1>🍽️ Diet Meals</h1>
            <p>Log and track your daily nutrition by meal</p>
          </div>

          {/* MACRO OVERVIEW */}
          <div className="macro-row">
            {MACROS.map((m) => {
              const val = totals[m.key];
              const pct = animate && val > 0 ? Math.min((val / m.max) * 100, 100) : 0;
              return (
                <div key={m.key} className="macro-card">
                  <span className="macro-icon">{m.icon}</span>
                  <div className="macro-val">{val} <span style={{ fontSize: 13, fontWeight: 400, color: "var(--muted)" }}>{m.suffix}</span></div>
                  <div className="macro-label">{m.label}</div>
                  <div className="macro-bar">
                    <div className="macro-bar-fill" style={{ width: `${pct}%`, background: m.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ADD MEAL CARD */}
          <p className="section-label">Add a Meal</p>
          <div className="add-card">
            <div className="add-card-title">🥘 Log New Meal</div>
            <div className="meal-form-row">
              <div className="meal-form-field">
                <label>Meal Type</label>
                <select className="meal-select" value={type} onChange={e => setType(e.target.value)}>
                  {MEAL_TYPES.map(t => <option key={t.label}>{t.label}</option>)}
                </select>
              </div>
              <div className="meal-form-field">
                <label>Food Name</label>
                <input className="meal-input" type="text" placeholder="e.g. Grilled Chicken" value={food}
                  onChange={e => setFood(e.target.value)} onKeyDown={e => e.key === "Enter" && addMeal()} />
              </div>
              <div className="meal-form-field">
                <label>Protein (g)</label>
                <input className="meal-input" type="number" placeholder="35" value={protein}
                  onChange={e => setProtein(e.target.value)} onKeyDown={e => e.key === "Enter" && addMeal()} />
              </div>
              <button className="add-btn" onClick={addMeal}>+ Add</button>
            </div>

            {/* Optional extras */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 12 }}>
              <div className="meal-form-field">
                <label>Calories (optional)</label>
                <input className="meal-input" type="number" placeholder="250" value={calories} onChange={e => setCalories(e.target.value)} />
              </div>
              <div className="meal-form-field">
                <label>Carbs g (optional)</label>
                <input className="meal-input" type="number" placeholder="40" value={carbs} onChange={e => setCarbs(e.target.value)} />
              </div>
              <div className="meal-form-field">
                <label>Fat g (optional)</label>
                <input className="meal-input" type="number" placeholder="10" value={fat} onChange={e => setFat(e.target.value)} />
              </div>
            </div>
          </div>

          {/* FILTER TABS */}
          <p className="section-label">Today's Meals</p>
          <div className="type-tabs">
            <button className={`type-tab ${filter === "All" ? "active-tab" : ""}`} onClick={() => setFilter("All")}>
              🍽️ All <span className="type-tab-count">{meals.length}</span>
            </button>
            {MEAL_TYPES.map(t => (
              <button key={t.label} className={`type-tab ${filter === t.label ? "active-tab" : ""}`} onClick={() => setFilter(t.label)}>
                {t.icon} {t.label}
                {countFor(t.label) > 0 && <span className="type-tab-count">{countFor(t.label)}</span>}
              </button>
            ))}
          </div>

          {/* MEAL LIST */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🍽️</span>
              <div className="empty-title">No meals logged yet</div>
              <div className="empty-sub">Use the form above to add your first meal.<br />Track your macros and stay on target!</div>
            </div>
          ) : (
            <div className="meals-list">
              {grouped.map(group => (
                <div key={group.label} className="meal-group">
                  <div className="meal-group-header">
                    <span className="meal-group-icon">{group.icon}</span>
                    <span className="meal-group-label">{group.label}</span>
                    <span className="meal-group-count">{group.items.length} item{group.items.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="meal-items">
                    {group.items.map((m, i) => (
                      <div key={i} className="meal-item" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="meal-item-left">
                          <div className="meal-dot" />
                          <div className="meal-item-info">
                            <div className="meal-item-name">{m.food}</div>
                            <div className="meal-item-time">{m.type} · {m.time}</div>
                          </div>
                        </div>
                        <div className="meal-item-right">
                          {m.calories > 0 && <span className="meal-cal-tag">{m.calories} kcal</span>}
                          <span className="meal-protein-tag">{m.protein}g protein</span>
                          <button className="meal-delete" onClick={() => deleteMeal(meals.indexOf(m))}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SUMMARY BANNER */}
          {meals.length > 0 && (
            <div className="summary-banner">
              <div className="summary-stats">
                {[
                  { val: totals.protein,  label: "Total Protein" },
                  { val: totals.calories, label: "Total Calories" },
                  { val: meals.length,    label: "Meals Logged" },
                ].map(s => (
                  <div key={s.label}>
                    <div className="summary-stat-val">{s.val}{s.label === "Total Protein" ? "g" : s.label === "Total Calories" ? " kcal" : ""}</div>
                    <div className="summary-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
              <span className="summary-emoji">💪</span>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
