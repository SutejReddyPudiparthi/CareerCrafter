import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../auth/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";

const JobSeekerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [savedJobsIds, setSavedJobsIds] = useState([]);
  const [jobsList, setJobsList] = useState([]);

  useEffect(() => {
    if (!user?.jobSeekerId) {
      setLoading(false);
      setProfile(null);
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [profileRes, appliedRes, recommendedRes, jobsRes] =
          await Promise.all([
            api.get(`/jobseekers/${user.jobSeekerId}`),
            api.get(`/applications/jobseeker/${user.jobSeekerId}`),
            api.get(`/jobseekers/${user.jobSeekerId}/recommendations`),
            api.get(`/joblistings`),
          ]);
        setProfile(profileRes.data);
        setJobsList(jobsRes.data);
        const jobsMap = {};
        jobsRes.data.forEach((job) => {
          jobsMap[job.jobListingId] = job.title;
        });
        const enrichedApps = appliedRes.data.map((app) => ({
          ...app,
          title: jobsMap[app.jobListingId] || "Untitled Job",
        }));
        setAppliedJobs(enrichedApps);
        setRecommendedJobs(recommendedRes.data);
        const saved = localStorage.getItem("savedJobs");
        const savedArr = saved ? JSON.parse(saved) : [];
        setSavedJobsIds(savedArr);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
      setLoading(false);
    };
    fetchAll();
  }, [user]);

  if (loading) {
    return (
      <div
        className="container my-4"
        style={{ maxWidth: 900, textAlign: "center" }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  const profileComplete = profile && profile.fullName && profile.email;
  if (!profileComplete) {
    return (
      <div className="container my-4" style={{ maxWidth: 900 }}>
        <div className="card p-4 mb-4 shadow-sm">
          <h4>Profile Status</h4>
          <p>You have not created your profile yet.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/profile/jobseeker")}
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4" style={{ maxWidth: 900 }}>
      <h2>Welcome back, {profile?.fullName || user.email}</h2>
      <section className="mb-4 p-3 border rounded shadow-sm">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4 style={{ margin: 0 }}>Profile Status</h4>
          <Link to="/profile/jobseeker" className="btn btn-primary">
            Go to Profile
          </Link>
        </div>
        <p>You have created your profile successfully.</p>
      </section>
      <section className="mb-4 p-3 border rounded shadow-sm">
        <h4>Applied Jobs ({appliedJobs.length})</h4>
        {appliedJobs.length === 0 ? (
          <p>You have not applied to any jobs yet.</p>
        ) : (
          <ul className="list-group">
            {appliedJobs.slice(0, 5).map((app) => (
              <li
                key={app.applicationId}
                className="list-group-item d-flex justify-content-between"
                style={{
                  pointerEvents: "none",
                  userSelect: "text",
                  cursor: "default",
                }}
              >
                <span style={{ color: "#1976d2", fontWeight: "600" }}>
                  {app.title}
                </span>
                <span
                  className="badge bg-info"
                  style={{ fontWeight: "500", fontSize: "0.9em" }}
                >
                  {app.status}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link to="/my-applications" className="btn btn-link mt-2 p-0">
          View All Applications
        </Link>
      </section>
      <section className="mb-4 p-3 border rounded shadow-sm">
        <h4>Recommended Jobs ({recommendedJobs.length})</h4>
        {recommendedJobs.length === 0 ? (
          <p>No recommendations available currently.</p>
        ) : (
          <ul className="list-group">
            {recommendedJobs.slice(0, 5).map((job) => (
              <li key={job.jobListingId} className="list-group-item">
                <Link to={`/jobs/${job.jobListingId}`}>{job.title}</Link>
              </li>
            ))}
          </ul>
        )}
        <Link to="/recommendations" className="btn btn-link mt-2">
          View All Recommendations
        </Link>
      </section>
      <section className="mb-4 p-3 border rounded shadow-sm">
        <h4>Resume</h4>
        <p>
          Manage your resumes here.
          <Link to="/resumes" className="btn btn-primary ms-2">
            Go to Resume Manager
          </Link>
        </p>
      </section>
      <section className="mb-4 p-3 border rounded shadow-sm">
        <h4>Saved Jobs ({savedJobsIds.length})</h4>
        {savedJobsIds.length === 0 ? (
          <p>No saved jobs yet.</p>
        ) : (
          <ul className="list-group">
            {savedJobsIds.map((jobId) => {
              const job = jobsList.find((j) => j.jobListingId === jobId);
              if (!job) return null;
              return (
                <li
                  key={job.jobListingId}
                  className="list-group-item d-flex justify-content-between"
                >
                  <Link to={`/jobs/${job.jobListingId}`}>{job.title}</Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default JobSeekerDashboard;
