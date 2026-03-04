import { useEffect, useState } from "react";
import API from "../api/axios";
import "./Dashboard.css";
import { Link } from "react-router-dom";
function Dashboard() {

  const [user, setUser] = useState("");
  const [food, setFood] = useState("");
  const [protein, setProtein] = useState("");
  const [meals, setMeals] = useState([]);

  useEffect(() => {

    API.get("/profile")
      .then((res) => {
        setUser(res.data.user);
      });

  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const addMeal = () => {

    const newMeal = {
      food,
      protein
    };

    setMeals([...meals, newMeal]);

    setFood("");
    setProtein("");

  };

  return (

    <div className="dashboard">

      <div className="sidebar">

        <h2>Nutrition App</h2>

        <ul>
  <li><Link to="/dashboard">Dashboard</Link></li>
  <li><Link to="/diet-goals">Diet Goals</Link></li>
  <li><Link to="/meals">Meals</Link></li>
  <li><Link to="/recipes">Recipes</Link></li>
  <li><Link to="/exercise">Exercise</Link></li>
</ul>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </div>

      <div className="main">

        <div className="header">
          <h1>Dashboard</h1>
          <h3>Welcome {user}</h3>
        </div>

        {/* Stats Cards */}

        <div className="cards">

          <div className="card">
            <h3>Calories</h3>
            <p>1800 kcal</p>
          </div>

          <div className="card">
            <h3>Protein</h3>
            <p>120 g</p>
          </div>

          <div className="card">
            <h3>Carbs</h3>
            <p>200 g</p>
          </div>

          <div className="card">
            <h3>Fat</h3>
            <p>60 g</p>
          </div>

        </div>

        {/* Add Meal Form */}

        <div className="meal-form">

          <h2>Add Meal</h2>

          <input
            placeholder="Food name"
            value={food}
            onChange={(e)=>setFood(e.target.value)}
          />

          <input
            placeholder="Protein (g)"
            value={protein}
            onChange={(e)=>setProtein(e.target.value)}
          />

          <button onClick={addMeal}>
            Add Meal
          </button>

        </div>

        {/* Meal List */}

        <div className="meal-list">

          <h2>Today's Meals</h2>

          {meals.map((meal, index) => (

            <div key={index} className="meal-item">

              <span>{meal.food}</span>

              <span>{meal.protein} g protein</span>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default Dashboard;