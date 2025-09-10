import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobSeekerProfile from "./pages/jobseeker/JobSeekerProfile";
import EmployerProfile from "./pages/employer/EmployerProfile";
import JobSeekerDashboard from "./pages/jobseeker/JobSeekerDashboard";
import JobsList from "./pages/jobs/JobsList";
import JobDetails from "./pages/jobs/JobDetails";
import PostJob from "./pages/employer/PostJob";
import MyApplications from "./pages/applications/MyApplications";
import ResumeManager from "./pages/resume/ResumeManager";
import Recommendations from "./pages/jobs/Recommendations";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import EmployerApplications from "./pages/applications/EmployerApplications";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import Password from "./pages/Password";
import Footer from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile/jobseeker"
            element={
              <PrivateRoute roles={["JOBSEEKER"]}>
                <JobSeekerProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/employer"
            element={
              <PrivateRoute roles={["EMPLOYER"]}>
                <EmployerProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/jobseeker/dashboard"
            element={
              <PrivateRoute roles={["JOBSEEKER"]}>
                <JobSeekerDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <PrivateRoute roles={["JOBSEEKER"]}>
                <JobsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <PrivateRoute roles={["JOBSEEKER"]}>
                <JobDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <PrivateRoute roles={["JOBSEEKER"]}>
                <MyApplications />
              </PrivateRoute>
            }
          />
          <Route
            path="/resumes"
            element={
              <PrivateRoute roles={["JOBSEEKER"]}>
                <ResumeManager />
              </PrivateRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <PrivateRoute roles={["JOBSEEKER"]}>
                <Recommendations />
              </PrivateRoute>
            }
          />
          <Route
            path="/employer/dashboard"
            element={
              <PrivateRoute roles={["EMPLOYER"]}>
                <EmployerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/employer/post-job"
            element={
              <PrivateRoute roles={["EMPLOYER"]}>
                <PostJob />
              </PrivateRoute>
            }
          />
          <Route
            path="/applications/employer"
            element={
              <PrivateRoute roles={["EMPLOYER"]}>
                <EmployerApplications />
              </PrivateRoute>
            }
          />
          <Route
            path="/employer/jobs"
            element={
              <PrivateRoute roles={["EMPLOYER"]}>
                <EmployerDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/password" element={<Password />} />

          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
