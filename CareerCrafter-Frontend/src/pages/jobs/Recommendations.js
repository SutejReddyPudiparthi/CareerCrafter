import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../auth/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Recommendations() {
  const { user, setUser } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("title");
  const [hasProfile, setHasProfile] = useState(!!user?.jobSeekerId);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileAndRecs = async () => {
      if (!user?.jobSeekerId) {
        try {
          setError(null);
          const userId = user?.userId || localStorage.getItem("userId");
          if (!userId) {
            setHasProfile(false);
            return;
          }
          const res = await api.get(`/jobseekers/user/${userId}`);
          setHasProfile(true);
          setUser((prevUser) => ({
            ...prevUser,
            jobSeekerId: res.data.jobSeekerId,
          }));
          await fetchRecs(res.data.jobSeekerId);
        } catch (e) {
          setHasProfile(false);
          setError("Failed to load profile or recommendations");
        }
      } else {
        await fetchRecs(user.jobSeekerId);
      }
    };

    const fetchRecs = async (seekerId) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/jobseekers/${seekerId}/recommendations`);
        setJobs(res.data || []);
      } catch (e) {
        setError("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndRecs();
  }, [user, setUser]);

  if (!hasProfile)
    return (
      <div className="alert alert-warning mt-4">
        You need a profile first.{" "}
        <Link to="/profile/jobseeker" className="btn btn-sm btn-primary ms-2">
          Create Profile
        </Link>
      </div>
    );

  const filteredJobs = jobs
    .filter(
      (job) =>
        (job.title?.toLowerCase().includes(filter.toLowerCase()) ?? false) ||
        (job.location?.toLowerCase().includes(filter.toLowerCase()) ?? false)
    )
    .sort((a, b) => (a[sortField] ?? "").localeCompare(b[sortField] ?? ""));
  return (
    <div className="container my-4" style={{ maxWidth: "900px" }}>
      <h3 className="mb-4" style={{ fontWeight: 700 }}>
        Recommended Jobs
      </h3>
      <div className="input-group mb-4">
        <input
          type="text"
          placeholder="Filter by title or location"
          className="form-control"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          className="form-select"
          value={sortField}
          style={{ maxWidth: "160px" }}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Sort by Title</option>
          <option value="location">Sort by Location</option>
        </select>
      </div>
      {loading && (
        <div className="spinner-container">
          <LoadingSpinner />
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {!loading && !error && filteredJobs.length === 0 && (
        <p>No recommendations available.</p>
      )}
      <div>
        {filteredJobs.map((job) => (
          <div
            key={job.jobListingId}
            className="card p-3 mb-4 shadow-sm"
            style={{
              borderRadius: 12,
              cursor: "pointer",
              transition: "box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <h5 style={{ fontWeight: 600, color: "#0d6efd" }}>{job.title}</h5>
            <p>{job.description}</p>
            <p>
              <strong>Location:</strong> {job.location}
            </p>
            <Link
              to={`/jobs/${job.jobListingId}`}
              className="btn btn-outline-primary mt-2"
              style={{ borderRadius: 8 }}
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
