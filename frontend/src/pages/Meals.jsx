import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Meals.css";
import "./Dashboard.css";

const NAV = [
  { to: "/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/diet-goals", icon: "🎯", label: "Diet Goals" },
  { to: "/meals",      icon: "🍽️", label: "Meals" },
  { to: "/recipes",    icon: "📖", label: "Recipes" },
  { to: "/exercise",   icon: "💪", label: "Exercise" },
];

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"];

function Meals() {
  const [type,    setType]    = useState("Breakfast");
  const [food,    setFood]    = useState("");
  const [protein, setProtein] = useState("");
  const [meals,   setMeals]   = useState([]);
  const { pathname } = useLocation();

  const addMeal = () => {
    if (!food || !protein) return;
    setMeals((prev) => [...prev, { type, food, protein: Number(protein) }]);
    setFood(""); setProtein("");
  };

  const totalProtein = meals.reduce((s, m) => s + m.protein, 0);

  const grouped = MEAL_TYPES.reduce((acc, t) => {
    const items = meals.filter((m) => m.type === t);
    if (items.length) acc[t] = items;
    return acc;
  }, {});

  return (
    <div className="dashboard">
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
      </div>
      <div className="main">
        <div className="meals-page">
          <h1>Diet Meals</h1>
          <p>Log and track your daily meals</p>
          <div className="card meal-add-card">
            <h2>Add Meal</h2>
            <div className="meal-form-row">
              <div className="meal-form-field">
                <label>Meal Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  {MEAL_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="meal-form-field" style={{ flex: 2 }}>
                <label>Food Name</label>
                <input type="text" placeholder="e.g. Grilled Chicken" value={food}
                  onChange={(e) => setFood(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addMeal()} />
              </div>
              <div className="meal-form-field">
                <label>Protein (g)</label>
                <input type="number" placeholder="e.g. 35" value={protein}
                  onChange={(e) => setProtein(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addMeal()} />
              </div>
              <button className="btn-primary" onClick={addMeal} style={{ marginBottom: "1px" }}>+ Add</button>
            </div>
          </div>
          <div className="meal-list-section">
            <h2>Today's Meals</h2>
            {meals.length === 0 ? (
              <p style={{ color: "var(--mid)", padding: "20px 0" }}>🍽️ No meals logged yet.</p>
            ) : (
              Object.entries(grouped).map(([mtype, items]) => (
                <div key={mtype} className="meal-type-group">
                  <p className="meal-type-label">{mtype}</p>
                  {items.map((m, i) => (
                    <div key={i} className="meal-card">
                      <strong>{m.food}</strong>
                      <span className="protein-tag">{m.protein}g protein</span>
                    </div>
                  ))}
                </div>
              ))
            )}
            {meals.length > 0 && (
              <div className="protein-summary">
                <div><h3>Total Protein Today</h3><p>{totalProtein}g</p></div>
                <span style={{ fontSize: "2.5rem" }}>💪</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Meals;