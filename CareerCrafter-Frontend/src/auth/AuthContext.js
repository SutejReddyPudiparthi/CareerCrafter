import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }
    const userId = localStorage.getItem("userId");
    const jobSeekerId = localStorage.getItem("jobSeekerId");
    const employerId = localStorage.getItem("employerId");
    const email = localStorage.getItem("email");
    let role =
      localStorage.getItem("role")?.replace("ROLE_", "").toUpperCase() || "";

    setUser({
      loggedIn: true,
      token,
      userId: Number(userId),
      jobSeekerId: jobSeekerId ? Number(jobSeekerId) : null,
      employerId: employerId ? Number(employerId) : null,
      email,
      role,
    });
    setLoadingUser(false);
  };

  const refreshUser = async () => {
    setLoadingUser(true);
    try {
      console.log("Refreshing user...");
      const res = await api.get("/auth/me");
      console.log("Refresh user data:", res.data);
      const u = res.data;
      if (!u || !u.userId) {
        setUser(null);
        localStorage.clear();
        return;
      }
      localStorage.setItem("jobSeekerId", u.jobSeekerId || "");
      localStorage.setItem("employerId", u.employerId || "");
      localStorage.setItem("email", u.email || "");
      const trimmedRole = u.role ? u.role.replace("ROLE_", "") : "";
      localStorage.setItem("role", trimmedRole);

      setUser({
        loggedIn: true,
        token: localStorage.getItem("token"),
        userId: u.userId,
        jobSeekerId: u.jobSeekerId || null,
        employerId: u.employerId || null,
        email: u.email,
        role: trimmedRole.toUpperCase(),
      });
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser((prevUser) => prevUser);
    } finally {
      setLoadingUser(false);
    }
  };

  const logout = () => {
    console.log("Logout called, clearing user");
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, refreshUser, logout, loadingUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
