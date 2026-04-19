import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Login() {
  /* ==========================
     STATE
  ========================== */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ==========================
     VALIDATION
  ========================== */
  const validateForm = () => {
    if (!email || !password) {
      setError("Please fill all fields");
      return false;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email");
      return false;
    }

    return true;
  };

  /* ==========================
     NORMAL LOGIN
  ========================== */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(
        "https://brainbridge-backend-1.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", email);

        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ==========================
     GOOGLE LOGIN
  ========================== */
  const handleGoogleSuccess = async (response) => {
    try {
      setError("");

      if (!response.credential) {
        setError("Google token missing");
        return;
      }

      setLoading(true);

      const res = await axios.post(
        "https://brainbridge-backend-1.onrender.com/google-login",
        {
          token: response.credential,
        }
      );

      console.log("Backend Response:", res.data);

      if (!res.data.token) {
        setError("Invalid Google login response");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email || "");

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Google Login Error:", err);
      setError("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ==========================
     UI STYLES
  ========================== */
  const containerStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f8c9a6, #fbe8c7, #fff6e5)",
  };

  const formStyle = {
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(12px)",
    padding: "40px",
    borderRadius: "16px",
    width: "340px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.9)",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#a44a3f",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "15px",
  };

  const errorStyle = {
    color: "#d9534f",
    marginTop: "10px",
    fontSize: "14px",
  };

  /* ==========================
     RENDER
  ========================== */
  return (
    <div style={containerStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        <h2 style={{ marginBottom: "20px", color: "#3a2e2a" }}>
          Welcome to BrainBridge
        </h2>

        {/* EMAIL */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={inputStyle}
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={inputStyle}
          required
        />

        {/* LOGIN BUTTON */}
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* GOOGLE LOGIN */}
        <div style={{ marginBottom: "10px" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log("Google Login Failed");
              setError("Google login failed");
            }}
          />
        </div>

        {/* ERROR */}
        {error && <p style={errorStyle}>{error}</p>}

        {/* FOOTER */}
        <p style={{ fontSize: "13px", marginTop: "15px", color: "#555" }}>
          Don’t have an account? Register
        </p>
      </form>
    </div>
  );
}

export default Login;