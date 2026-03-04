import { useState } from "react";
import API from "../api/axios";
import "./DietGoals.css";

function DietGoals() {

  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/diet-goals", {
        calories_goal: calories,
        protein_goal: protein,
        carbs_goal: carbs,
        fat_goal: fat
      });

      alert("Goals saved successfully!");

    } catch (error) {
      console.error(error);
      alert("Error saving goals");
    }
  };

  return (

    <div className="goals-container">

      <h1 className="goals-title">Diet Goals</h1>
      <p className="goals-subtitle">Set your daily nutrition targets</p>

      <form className="goals-form" onSubmit={handleSubmit}>

        <div className="goal-field">
          <label>Calories Goal</label>
          <input
            type="number"
            placeholder="Enter calories"
            value={calories}
            onChange={(e)=>setCalories(e.target.value)}
          />
        </div>

        <div className="goal-field">
          <label>Protein Goal (g)</label>
          <input
            type="number"
            placeholder="Enter protein grams"
            value={protein}
            onChange={(e)=>setProtein(e.target.value)}
          />
        </div>

        <div className="goal-field">
          <label>Carbs Goal (g)</label>
          <input
            type="number"
            placeholder="Enter carbs grams"
            value={carbs}
            onChange={(e)=>setCarbs(e.target.value)}
          />
        </div>

        <div className="goal-field">
          <label>Fat Goal (g)</label>
          <input
            type="number"
            placeholder="Enter fat grams"
            value={fat}
            onChange={(e)=>setFat(e.target.value)}
          />
        </div>

        <button className="save-goals-btn">
          Save Goals
        </button>

      </form>

    </div>

  );

}

export default DietGoals;