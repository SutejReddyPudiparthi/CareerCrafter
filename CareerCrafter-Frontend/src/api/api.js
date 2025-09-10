import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8081/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      console.warn("Unauthorized, redirecting to login");
      localStorage.clear();
      window.location = "/login";
    }
    return Promise.reject(err);
  }
);

export const getJobSeekerByUserId = (userId) =>
  api.get(`/jobseekers/user/${userId}`);
export const getJobSeekerById = (id) => api.get(`/jobseekers/${id}`);
export const createJobSeeker = (data) => api.post("/jobseekers", data);
export const updateJobSeeker = (data) => api.put("/jobseekers", data);

export const getEmployerByUserId = (userId) =>
  api.get(`/employers/user/${userId}`);
export const getEmployerById = (id) => api.get(`/employers/${id}`);
export const createEmployer = (data) => api.post("/employers", data);
export const updateEmployer = (data) => api.put("/employers", data);
export const getJobRecommendations = (jobSeekerId) =>
  api.get(`/jobseekers/${jobSeekerId}/recommendations`);
export const verifyUserCredentials = (data) => api.post("/users/verify", data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (data) => api.post("/auth/reset-password", data);

export default api;
