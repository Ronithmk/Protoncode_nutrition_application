import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Exercise.css";
import "./Dashboard.css";

const NAV = [
  { to: "/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/diet-goals", icon: "🎯", label: "Diet Goals" },
  { to: "/meals",      icon: "🍽️", label: "Meals" },
  { to: "/recipes",    icon: "📖", label: "Recipes" },
  { to: "/exercise",   icon: "💪", label: "Exercise" },
];

const EXERCISES = {
  Chest:     { icon: "🏋️", moves: ["Bench Press", "Push Ups", "Incline Dumbbell Press", "Chest Fly"] },
  Back:      { icon: "🦾", moves: ["Pull Ups", "Lat Pulldown", "Seated Row", "Deadlift"] },
  Legs:      { icon: "🦵", moves: ["Squats", "Leg Press", "Lunges", "Leg Curl"] },
  Shoulders: { icon: "💪", moves: ["Shoulder Press", "Lateral Raise", "Front Raise", "Arnold Press"] },
  Arms:      { icon: "🦾", moves: ["Bicep Curl", "Tricep Pushdown", "Hammer Curl", "Dips"] },
  Abs:       { icon: "🔥", moves: ["Crunches", "Plank", "Leg Raises", "Russian Twists"] },
};

function Exercise() {
  const [selected, setSelected] = useState(null);
  const { pathname } = useLocation();

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
        <div className="exercise-page">
          <h1>Exercise Tracker</h1>
          <p>Select a muscle group to see recommended exercises</p>
          <div className="body-grid">
            {Object.entries(EXERCISES).map(([part, { icon }]) => (
              <button key={part} className={`body-btn ${selected === part ? "active" : ""}`}
                onClick={() => setSelected(selected === part ? null : part)}>
                <span className="body-btn-icon">{icon}</span>{part}
              </button>
            ))}
          </div>
          {selected && (
            <div className="card exercise-list-wrap">
              <h2>{EXERCISES[selected].icon} {selected} Exercises</h2>
              {EXERCISES[selected].moves.map((ex, i) => (
                <div key={i} className="exercise-item">
                  <span className="exercise-num">{i + 1}</span>
                  <span className="exercise-name">{ex}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Exercise;