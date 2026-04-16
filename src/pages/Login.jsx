import { useState } from "react";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ NEW

  /* ==========================
     LOGIN
  ========================== */

  const handleLogin = async (e) => {

    e.preventDefault();

    setError(""); // ✅ clear old errors

    try {

      const response = await fetch("https://brainbridge-backend-1.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (response.ok) {

        // ✅ store data correctly
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", email);

        // ✅ redirect
        window.location.href = "/dashboard";

      } else {

        // ❌ NO ALERT → CLEAN ERROR UI
        setError(data.message || "Invalid email or password");

      }

    } catch (error) {

      console.error(error);
      setError("Server error. Please try again.");

    }

  };

 return (
  <div style={{
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f8c9a6, #fbe8c7, #fff6e5)"
  }}>

    <form
      onSubmit={handleLogin}
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
        padding: "40px",
        borderRadius: "16px",
        width: "320px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        textAlign: "center"
      }}
    >

      <h2 style={{ marginBottom: "20px", color: "#3a2e2a" }}>
        Welcome to BrainBridge
      </h2>

      {/* EMAIL */}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "12px",
          borderRadius: "10px",
          border: "none",
          outline: "none",
          background: "rgba(255,255,255,0.9)",
          color: "#3a2e2a"
        }}
      />

      {/* PASSWORD */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "12px",
          borderRadius: "10px",
          border: "none",
          outline: "none",
          background: "rgba(255,255,255,0.9)",
          color: "#3a2e2a"
        }}
      />

      {/* BUTTON */}
      <button
        type="submit"
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "none",
          background: "#a44a3f",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Login
      </button>

      {/* ERROR */}
      {error && (
        <p style={{
          color: "#d9534f",
          marginTop: "10px",
          fontSize: "14px"
        }}>
          {error}
        </p>
      )}

    </form>
  </div>
);
}

export default Login;