import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import DietGoals from './pages/DietGoals'
import Meals from './pages/Meals'
import Recipes from './pages/Recipes'
import Exercise from './pages/Exercise'
import Login from './pages/Login'
import Register from './pages/Register'

// ✅ Protected Route — redirects to /login if not logged in
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — must be logged in */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/diet-goals" element={<ProtectedRoute><DietGoals /></ProtectedRoute>} />
        <Route path="/meals" element={<ProtectedRoute><Meals /></ProtectedRoute>} />
        <Route path="/recipes" element={<ProtectedRoute><Recipes /></ProtectedRoute>} />
        <Route path="/exercise" element={<ProtectedRoute><Exercise /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)