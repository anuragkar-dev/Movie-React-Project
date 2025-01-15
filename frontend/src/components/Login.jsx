import React, { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import "../css/Auth.css"; // Assuming you have the Auth.css file in the styles folder

const Login = () => {
  const { user } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(true);  // Track error visibility
  const navigate = useNavigate();  // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
      setShowError(true); // Show error message on failure
    }
  };

  if (user) {
    navigate("/");  // Redirect to home if user is already logged in
    return null;  // Prevent rendering anything after redirect
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Login</h2>
        {showError && error && (
          <div className="auth-error">
            {error}
            <button
              className="close-btn"
              onClick={() => setShowError(false)} // Dismiss error on click
            >
              &times;
            </button>
          </div>
        )}
        <form onSubmit={handleLogin}>
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button className="auth-button" type="submit">Login</button>
        </form>
        <div className="auth-footer">
          Don't have an account? <a href="/signup">Sign up here</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
