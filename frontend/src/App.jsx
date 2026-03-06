import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DietGoals from "./pages/DietGoals";
import Exercise  from "./pages/Exercise";
import Meals     from "./pages/Meals";
import Recipes   from "./pages/Recipes";
import Welcome from "./pages/Welcome";   // ← add this



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/diet-goals" element={<DietGoals />} />
        <Route path="/exercise"   element={<Exercise />} />
        <Route path="/meals"      element={<Meals />} />
        <Route path="/recipes"    element={<Recipes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;