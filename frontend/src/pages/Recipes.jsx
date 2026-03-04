import { useState } from "react";
import "./Recipes.css";

function Recipes() {

  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const recipes = [
    {
      name: "High Protein Omelette",
      protein: "25g",
      ingredients: ["3 Eggs", "Onion", "Spinach", "Salt"],
      steps: [
        "Beat the eggs",
        "Add vegetables",
        "Cook on pan",
        "Serve hot"
      ]
    },
    {
      name: "Chicken Salad",
      protein: "35g",
      ingredients: ["Grilled Chicken", "Lettuce", "Olive Oil", "Tomatoes"],
      steps: [
        "Cut grilled chicken",
        "Mix vegetables",
        "Add olive oil",
        "Serve fresh"
      ]
    },
    {
      name: "Protein Smoothie",
      protein: "30g",
      ingredients: ["Milk", "Banana", "Peanut Butter", "Protein Powder"],
      steps: [
        "Add all ingredients to blender",
        "Blend for 30 seconds",
        "Pour into glass",
        "Serve chilled"
      ]
    },
    {
      name: "Oats Bowl",
      protein: "20g",
      ingredients: ["Oats", "Milk", "Honey", "Almonds"],
      steps: [
        "Cook oats in milk",
        "Add honey",
        "Top with almonds",
        "Serve warm"
      ]
    }
  ];

  return (

    <div className="recipes-container">

      <h1>Diet Recipes</h1>
      <p>Healthy recipes for your diet</p>

      {/* RECIPE CARDS */}

      <div className="recipe-grid">

        {recipes.map((recipe, index)=>(
          <div
            key={index}
            className="recipe-card"
            onClick={()=>setSelectedRecipe(recipe)}
          >
            <h3>{recipe.name}</h3>
            <p>{recipe.protein} Protein</p>
          </div>
        ))}

      </div>

      {/* RECIPE DETAILS */}

      {selectedRecipe && (

        <div className="recipe-details">

          <h2>{selectedRecipe.name}</h2>

          <h3>Ingredients</h3>
          <ul>
            {selectedRecipe.ingredients.map((item, i)=>(
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h3>Steps</h3>
          <ol>
            {selectedRecipe.steps.map((step, i)=>(
              <li key={i}>{step}</li>
            ))}
          </ol>

        </div>

      )}

    </div>

  );

}

export default Recipes;