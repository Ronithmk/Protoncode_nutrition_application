import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";

const NAV = [
  { to: "/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/diet-goals", icon: "🎯", label: "Diet Goals" },
  { to: "/meals",      icon: "🍽️", label: "Meals" },
  { to: "/recipes",    icon: "📖", label: "Recipes" },
  { to: "/exercise",   icon: "💪", label: "Exercise" },
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
      <button className="logout-btn" onClick={onLogout}>
        <span>🚪</span> Logout
      </button>
    </div>
  );
}

function Dashboard() {
  const [user,    setUser]    = useState("");
  const [food,    setFood]    = useState("");
  const [protein, setProtein] = useState("");
  const [meals,   setMeals]   = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/profile").then((res) => setUser(res.data.user)).catch(() => navigate("/"));
  }, []);

  const logout = () => { localStorage.removeItem("token"); navigate("/"); };

  const addMeal = () => {
    if (!food || !protein) return;
    setMeals((prev) => [...prev, { food, protein: Number(protein) }]);
    setFood(""); setProtein("");
  };

  const totalProtein = meals.reduce((s, m) => s + m.protein, 0);

  const stats = [
    { label: "Calories", value: "1,800", unit: "kcal", icon: "🔥", cls: "green", pct: 72 },
    { label: "Protein",  value: totalProtein || 120, unit: "g", icon: "💪", cls: "blue",  pct: Math.min((totalProtein / 120) * 100, 100) || 60 },
    { label: "Carbs",    value: "200",   unit: "g",   icon: "🌾", cls: "amber", pct: 55 },
    { label: "Fat",      value: "60",    unit: "g",   icon: "🥑", cls: "rose",  pct: 40 },
  ];

  return (
    <div className="dashboard">
      <Sidebar onLogout={logout} />
      <div className="main">
        <div className="header">
          <div>
            <h1>Dashboard</h1>
            <p className="header-greeting">Here's your nutrition summary for today</p>
          </div>
          {user && <span className="header-badge">👋 {user}</span>}
        </div>

        <div className="cards">
          {stats.map((s) => (
            <div key={s.label} className={`stat-card ${s.cls}`}>
              <span className="stat-icon">{s.icon}</span>
              <h3>{s.label}</h3>
              <p>{s.value} <span className="stat-unit">{s.unit}</span></p>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card meal-form">
          <h2>Add Meal</h2>
          <div className="meal-inputs">
            <input className="input" type="text" placeholder="Food name"
              value={food} onChange={(e) => setFood(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMeal()} />
            <input className="input" type="number" placeholder="Protein (g)"
              value={protein} onChange={(e) => setProtein(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMeal()} />
            <button className="btn-primary" onClick={addMeal}>+ Add</button>
          </div>
        </div>

        <div className="card meal-list">
          <h2>Today's Meals</h2>
          {meals.length === 0 ? (
            <p className="empty-state">🍽️ No meals logged yet. Add your first one above!</p>
          ) : (
            meals.map((meal, i) => (
              <div key={i} className="meal-item">
                <span className="meal-item-name">{meal.food}</span>
                <span className="meal-protein-tag">{meal.protein}g protein</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;