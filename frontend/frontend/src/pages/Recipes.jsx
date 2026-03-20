import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Recipes.css";
import "./Dashboard.css";

const NAV = [
  { to: "/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/diet-goals", icon: "🎯", label: "Diet Goals" },
  { to: "/meals",      icon: "🍽️", label: "Meals" },
  { to: "/recipes",    icon: "📖", label: "Recipes" },
  { to: "/exercise",   icon: "💪", label: "Exercise" },
];

const RECIPES = [
  { emoji: "🍳", name: "High Protein Omelette", protein: "25g", time: "10 min",
    ingredients: ["3 Eggs", "Onion", "Spinach", "Salt", "Olive Oil"],
    steps: ["Beat the eggs with a pinch of salt", "Dice onion and wilt spinach in pan", "Pour in eggs and cook on medium heat", "Fold and serve hot"] },
  { emoji: "🥗", name: "Chicken Salad", protein: "35g", time: "15 min",
    ingredients: ["Grilled Chicken 150g", "Lettuce", "Cherry Tomatoes", "Olive Oil", "Lemon"],
    steps: ["Slice grilled chicken into strips", "Tear lettuce and halve tomatoes", "Combine in bowl with olive oil", "Squeeze lemon and serve fresh"] },
  { emoji: "🥤", name: "Protein Smoothie", protein: "30g", time: "5 min",
    ingredients: ["Milk 250ml", "1 Banana", "Peanut Butter 2 tbsp", "Protein Powder 1 scoop"],
    steps: ["Add all ingredients to blender", "Blend on high for 30 seconds", "Check consistency", "Pour into glass and serve chilled"] },
  { emoji: "🥣", name: "Oats Bowl", protein: "20g", time: "10 min",
    ingredients: ["Oats 80g", "Milk 200ml", "Honey 1 tbsp", "Almonds", "Banana slices"],
    steps: ["Cook oats in milk over medium heat", "Stir continuously for 5 minutes", "Transfer to bowl and drizzle honey", "Top with almonds and banana"] },
];

function Recipes() {
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
        <div className="recipes-page">
          <h1>Diet Recipes</h1>
          <p>Tap a recipe to view ingredients and steps</p>
          <div className="recipe-grid">
            {RECIPES.map((r, i) => (
              <div key={i} className={`recipe-card ${selected?.name === r.name ? "selected" : ""}`}
                onClick={() => setSelected(selected?.name === r.name ? null : r)}>
                <span className="recipe-time">⏱ {r.time}</span>
                <span className="recipe-emoji">{r.emoji}</span>
                <h3>{r.name}</h3>
                <span className="protein-badge">💪 {r.protein} protein</span>
              </div>
            ))}
          </div>
          {selected && (
            <div className="recipe-detail">
              <div className="recipe-detail-header">
                <span className="recipe-detail-emoji">{selected.emoji}</span>
                <div><h2>{selected.name}</h2><span className="protein-badge">💪 {selected.protein} · ⏱ {selected.time}</span></div>
              </div>
              <p className="recipe-section-title">Ingredients</p>
              <ul className="ingredients-list">{selected.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>
              <p className="recipe-section-title">Steps</p>
              <ol className="steps-list">{selected.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              <button className="recipe-close-btn" onClick={() => setSelected(null)}>✕ Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recipes;