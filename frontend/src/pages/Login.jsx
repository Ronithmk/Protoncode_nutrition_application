import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {

    try {

      const res = await API.post("/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.access_token);

      navigate("/dashboard");

    } catch (err) {

      alert("Invalid email or password");

    }

  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h1 className="app-title">Nutrition Tracker</h1>
        <p className="subtitle">Track your calories & protein easily</p>

        <input
          className="login-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={login}>
          Login
        </button>
        <p style={{marginTop:"10px"}}>
  Don't have account? 
  <span
    style={{color:"blue", cursor:"pointer"}}
    onClick={()=>navigate("/register")}
  >
    Register
  </span>
</p>

      </div>

    </div>

  );

}

export default Login;