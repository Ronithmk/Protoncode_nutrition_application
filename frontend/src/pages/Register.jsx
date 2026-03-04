import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const register = async () => {

    try {

      await API.post("/register", {
        name,
        email,
        password
      });

      alert("Registration successful");

      // Go to login page
      navigate("/");

    } catch (err) {

      alert("Registration failed");

    }

  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h1 className="app-title">Create Account</h1>

        <input
          className="login-input"
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          className="login-input"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="login-button" onClick={register}>
          Register
        </button>

        <p style={{marginTop:"10px"}}>
          Already have account? 
          <span
            style={{color:"blue", cursor:"pointer"}}
            onClick={()=>navigate("/")}
          >
            Login
          </span>
        </p>

      </div>

    </div>

  );

}

export default Register;