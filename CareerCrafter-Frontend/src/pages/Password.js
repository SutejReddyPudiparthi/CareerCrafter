import React, { useState } from "react";
import api from "../api/api";

export default function Password() {
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      console.log("Forgot password response:", res.data);
      if (!res.data.token) {
        setError("No reset token received from server. Please try again.");
        setLoading(false);
        return;
      }
      setToken(res.data.token);
      setSuccessMsg(res.data.message || "Password reset token generated.");
      setStep("reset");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to request password reset"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (!token) {
      setError("Reset token is missing. Please request a new password reset.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      setSuccessMsg("Password reset successfully! Redirecting to login...");
      setStep("done");
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: "3rem" }}>
      {step === "request" && (
        <>
          <h3>Forgot Password</h3>
          <form onSubmit={handleForgotSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Registered Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Processing..." : "Send Reset Link"}
            </button>
          </form>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {successMsg && (
            <div className="alert alert-success mt-3">{successMsg}</div>
          )}
        </>
      )}

      {step === "reset" && (
        <>
          <h3>Reset Password</h3>
          <form onSubmit={handleResetSubmit}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {successMsg && (
            <div className="alert alert-success mt-3">{successMsg}</div>
          )}
        </>
      )}

      {step === "done" && (
        <div className="alert alert-success mt-5">
          Password reset successful! Redirecting to login page...
        </div>
      )}
    </div>
  );
}
