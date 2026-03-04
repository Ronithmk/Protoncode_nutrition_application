import { useState } from "react";
import "./Meals.css";

function Meals() {

  const [mealType, setMealType] = useState("Breakfast");
  const [food, setFood] = useState("");
  const [protein, setProtein] = useState("");
  const [meals, setMeals] = useState([]);

  const addMeal = () => {

    if (!food || !protein) {
      alert("Enter food and protein");
      return;
    }

    const newMeal = {
      type: mealType,
      food: food,
      protein: protein
    };

    setMeals([...meals, newMeal]);

    setFood("");
    setProtein("");
  };

  const totalProtein = meals.reduce(
    (sum, meal) => sum + Number(meal.protein),
    0
  );

  return (

    <div className="meals-container">

      <h1>Diet Meals</h1>
      <p>Track your daily meals</p>

      {/* ADD MEAL FORM */}

      <div className="meal-form">

        <select
          value={mealType}
          onChange={(e)=>setMealType(e.target.value)}
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snacks</option>
        </select>

        <input
          type="text"
          placeholder="Food name"
          value={food}
          onChange={(e)=>setFood(e.target.value)}
        />

        <input
          type="number"
          placeholder="Protein (g)"
          value={protein}
          onChange={(e)=>setProtein(e.target.value)}
        />

        <button onClick={addMeal}>
          Add Meal
        </button>

      </div>

      {/* MEAL LIST */}

      <div className="meal-list">

        <h2>Your Meals</h2>

        {meals.length === 0 ? (
          <p>No meals added yet.</p>
        ) : (

          <ul>
            {meals.map((meal, index)=>(
              <li key={index}>
                <strong>{meal.type}</strong> - {meal.food} ({meal.protein}g protein)
              </li>
            ))}
          </ul>

        )}

      </div>

      {/* PROTEIN SUMMARY */}

      <div className="protein-summary">

        <h3>Total Protein Today</h3>
        <p>{totalProtein} g</p>

      </div>

    </div>

  );

}

export default Meals;