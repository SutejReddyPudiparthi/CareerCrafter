import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../auth/AuthContext";
import loginBg from "../assets/Login.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token } = res.data;
      localStorage.setItem("token", token);

      const usersRes = await api.get("/users");
      const user = (usersRes.data || []).find(
        (u) => String(u.email).toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        setError("User not found in database");
        return;
      }

      let role = user.userType?.replace("ROLE_", "") || "";
      localStorage.setItem("userId", user.userId);
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", role);

      let jobSeekerId = null;
      let employerId = null;

      if (role === "JOBSEEKER") {
        try {
          const jsRes = await api.get(`/jobseekers/user/${user.userId}`);
          if (jsRes.data) {
            jobSeekerId = jsRes.data.jobId || jsRes.data.jobSeekerId;
            localStorage.setItem("jobSeekerId", jobSeekerId);
          } else {
            const newJs = await api.post("/jobseekers", {
              userId: user.userId,
            });
            jobSeekerId = newJs.data.jobSeekerId;
          }
        } catch {
          localStorage.removeItem("jobSeekerId");
        }
      }

      if (role === "EMPLOYER") {
        try {
          const empRes = await api.get(`/employers/user/${user.userId}`);
          if (empRes.data) {
            employerId = empRes.data.employerId;
            localStorage.setItem("employerId", employerId);
          } else {
            localStorage.removeItem("employerId");
          }
        } catch {
          localStorage.removeItem("employerId");
        }
      }

      setUser({
        loggedIn: true,
        token,
        userId: user.userId,
        email: user.email,
        role,
        jobSeekerId,
        employerId,
      });
      navigate("/");
    } catch (err) {
      const msg = err.response?.data || "Invalid credentials or server error.";
      setError(msg);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        className="card shadow-sm p-4"
        style={{
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          minWidth: 320,
          maxWidth: 400,
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 1)",
        }}
      >
        <h2 className="mb-4">Login</h2>
        <form onSubmit={handleLogin} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              aria-describedby="passwordHelp"
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={!email || !password}
          >
            Login
          </button>
        </form>
        <div className="mt-3 text-center">
          <Link to="/password" className="btn btn-link">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
