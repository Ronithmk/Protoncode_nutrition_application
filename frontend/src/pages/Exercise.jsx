import { useState } from "react";
import "./Exercise.css";

function Exercise() {

  const [selectedPart, setSelectedPart] = useState(null);

  const exercises = {
    Chest: ["Bench Press", "Push Ups", "Incline Dumbbell Press", "Chest Fly"],
    Back: ["Pull Ups", "Lat Pulldown", "Seated Row", "Deadlift"],
    Legs: ["Squats", "Leg Press", "Lunges", "Leg Curl"],
    Shoulders: ["Shoulder Press", "Lateral Raise", "Front Raise", "Arnold Press"],
    Arms: ["Bicep Curl", "Tricep Pushdown", "Hammer Curl", "Dips"],
    Abs: ["Crunches", "Plank", "Leg Raises", "Russian Twists"]
  };

  return (

    <div className="exercise-container">

      <h1>Exercise Tracker</h1>
      <p>Select a body part to see exercises</p>

      {/* BODY PART BUTTONS */}

      <div className="body-parts">

        {Object.keys(exercises).map((part) => (
          <button
            key={part}
            className="body-btn"
            onClick={() => setSelectedPart(part)}
          >
            {part}
          </button>
        ))}

      </div>

      {/* EXERCISE LIST */}

      {selectedPart && (
        <div className="exercise-list">

          <h2>{selectedPart} Exercises</h2>

          <ul>
            {exercises[selectedPart].map((ex, index) => (
              <li key={index}>{ex}</li>
            ))}
          </ul>

        </div>
      )}

    </div>

  );
}

export default Exercise;