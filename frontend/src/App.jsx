import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DietGoals from "./pages/DietGoals";
import Exercise  from "./pages/Exercise";
import Meals     from "./pages/Meals";
import Recipes   from "./pages/Recipes";
import Welcome   from "./pages/Welcome";
import Admin     from "./pages/Admin";

// ── Protects regular user pages ───────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user  = localStorage.getItem("user");
  if (!token || !user) return <Navigate to="/" replace />;
  try {
    JSON.parse(user);
    return children;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }
}

// ── Protects admin pages — token + role must be "admin" ───────────────────────
function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  if (!token)          return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/"         element={<Welcome />} />
        <Route path="/welcome"  element={<Navigate to="/" replace />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User protected routes */}
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/diet-goals" element={<ProtectedRoute><DietGoals /></ProtectedRoute>} />
        <Route path="/exercise"   element={<ProtectedRoute><Exercise /></ProtectedRoute>} />
        <Route path="/meals"      element={<ProtectedRoute><Meals /></ProtectedRoute>} />
        <Route path="/recipes"    element={<ProtectedRoute><Recipes /></ProtectedRoute>} />

        {/* Admin protected route */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
