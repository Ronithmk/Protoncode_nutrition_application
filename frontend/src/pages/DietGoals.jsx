import { useState } from "react";
import API from "../api/axios";
import { Link, useLocation } from "react-router-dom";
import "./DietGoals.css";
import "./Dashboard.css";

const NAV = [
  { to: "/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/diet-goals", icon: "🎯", label: "Diet Goals" },
  { to: "/meals",      icon: "🍽️", label: "Meals" },
  { to: "/recipes",    icon: "📖", label: "Recipes" },
  { to: "/exercise",   icon: "💪", label: "Exercise" },
];

const GOALS = [
  { key: "calories", label: "Calories", unit: "kcal/day", icon: "🔥", cls: "green", placeholder: "e.g. 2000" },
  { key: "protein",  label: "Protein",  unit: "grams/day", icon: "💪", cls: "blue",  placeholder: "e.g. 150" },
  { key: "carbs",    label: "Carbs",    unit: "grams/day", icon: "🌾", cls: "amber", placeholder: "e.g. 250" },
  { key: "fat",      label: "Fat",      unit: "grams/day", icon: "🥑", cls: "rose",  placeholder: "e.g. 65" },
];

function DietGoals() {
  const [values,  setValues]  = useState({ calories: "", protein: "", carbs: "", fat: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { pathname } = useLocation();

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (Object.values(values).some((v) => !v)) { alert("Please fill all fields"); return; }
    setLoading(true); setSuccess(false);
    try {
      await API.post("/diet-goals", { calories_goal: values.calories, protein_goal: values.protein, carbs_goal: values.carbs, fat_goal: values.fat });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch { alert("Error saving goals"); }
    finally { setLoading(false); }
  };

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
        <div className="goals-page">
          <div className="goals-page-header">
            <h1>Diet Goals</h1>
            <p>Set your daily nutrition targets</p>
          </div>
          <div className="goals-grid">
            {GOALS.map((g) => (
              <div key={g.key} className="goal-card">
                <div className="goal-card-header">
                  <div className={`goal-card-icon ${g.cls}`}>{g.icon}</div>
                  <div><label>{g.label}</label><small>{g.unit}</small></div>
                </div>
                <input type="number" placeholder={g.placeholder} value={values[g.key]} onChange={set(g.key)} />
              </div>
            ))}
          </div>
          {success && <div className="goals-success">✅ Goals saved successfully!</div>}
          <div className="goals-save-row">
            <button className="save-goals-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving…" : "Save Goals"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DietGoals;