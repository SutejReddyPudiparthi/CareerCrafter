import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/api";
import { Link } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [sortOrderLocal, setSortOrderLocal] = useState("desc");
  const { user } = useContext(AuthContext);
  const [savedJobs, setSavedJobs] = useState(getSavedJobsFromStorage());
  const [appliedJobs, setAppliedJobs] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query")?.trim().toLowerCase() || "";
  const sortOrderUrl = params.get("sort");
  const sortOrder = sortOrderUrl || sortOrderLocal;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSavedJobs(getSavedJobsFromStorage());

    const fetchAppliedJobs = async () => {
      if (user?.role === "JOBSEEKER" && user.jobSeekerId) {
        try {
          const res = await api.get(
            `/applications/jobseeker/${user.jobSeekerId}`
          );
          setAppliedJobs(res.data.map((app) => app.jobListingId));
        } catch (err) {
          console.error("Failed to fetch applied jobs", err);
        }
      }
    };

    const loadJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/joblistings");
        setJobs(res.data.filter((job) => job.active));
        await fetchAppliedJobs();
      } catch (err) {
        console.error("Error loading jobs", err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [user]);

  function getSavedJobsFromStorage() {
    const saved = localStorage.getItem("savedJobs");
    return saved ? JSON.parse(saved) : [];
  }

  function saveJobToStorage(jobId) {
    const saved = getSavedJobsFromStorage();
    if (!saved.includes(jobId)) {
      saved.push(jobId);
      localStorage.setItem("savedJobs", JSON.stringify(saved));
    }
  }

  function removeJobFromStorage(jobId) {
    let saved = getSavedJobsFromStorage();
    saved = saved.filter((id) => id !== jobId);
    localStorage.setItem("savedJobs", JSON.stringify(saved));
  }

  const handleSave = (jobId) => {
    if (savedJobs.includes(jobId)) {
      removeJobFromStorage(jobId);
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
    } else {
      saveJobToStorage(jobId);
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  const filteredJobs = jobs
    .filter((job) => {
      if (!query) return true;
      return (
        job.title?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.companyName?.toLowerCase().includes(query) ||
        job.requiredSkills?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (!a.postedDate || !b.postedDate) return 0;
      const ad = new Date(a.postedDate);
      const bd = new Date(b.postedDate);
      return sortOrder === "asc" ? ad - bd : bd - ad;
    });

  if (loading) {
    return (
      <div
        className="container my-4"
        style={{ maxWidth: "900px", textAlign: "center", marginTop: "4rem" }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  if (filteredJobs.length === 0) {
    return (
      <div
        className="container my-4"
        style={{ maxWidth: "900px", textAlign: "center", marginTop: "4rem" }}
      >
        <span style={{ fontSize: 44, color: "#1976d2" }}>🕵️‍♂️</span>
        <div style={{ marginTop: 18, fontWeight: 500, fontSize: 20 }}>
          No jobs found matching your search.
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4" style={{ maxWidth: "900px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Job Listings</h2>
        <div>
          <label style={{ marginRight: 8, fontWeight: 500, color: "#1976d2" }}>
            Sort:
          </label>
          <select
            className="form-select d-inline-block"
            value={sortOrder}
            onChange={(e) => setSortOrderLocal(e.target.value)}
            style={{ width: 170, display: "inline-block" }}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
      <div>
        {filteredJobs.map((job) => (
          <div
            key={job.jobListingId}
            className="card p-3 mb-3 shadow-sm"
            style={{
              borderRadius: 12,
              cursor: "pointer",
              transition: "box-shadow 0.3s ease",
              position: "relative",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <button
              onClick={() => handleSave(job.jobListingId)}
              style={{
                position: "absolute",
                top: 16,
                right: 18,
                border: "none",
                background: "transparent",
                color: "#1976d2",
                width: 24,
                height: 24,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "1.5em",
                outline: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
              aria-label={
                savedJobs.includes(job.jobListingId) ? "Unsave Job" : "Save Job"
              }
              title={
                savedJobs.includes(job.jobListingId) ? "Unsave Job" : "Save Job"
              }
            >
              {savedJobs.includes(job.jobListingId) ? (
                <MdBookmark style={{ color: "#1976d2" }} />
              ) : (
                <MdBookmarkBorder style={{ color: "#1976d2" }} />
              )}
            </button>

            <h4 style={{ color: "#1976d2", fontWeight: 600 }}>{job.title}</h4>
            <p>{job.description}</p>
            <p>
              <b>Company:</b> {job.companyName} | <b>Location:</b>{" "}
              {job.location} | <b>Posted Date:</b> {formatDate(job.postedDate)}
            </p>

            {/* Applied badge */}
            {appliedJobs.includes(job.jobListingId) && (
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 60,
                  backgroundColor: "#5cb85c",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "14px",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                }}
              >
                Applied
              </div>
            )}

            <Link
              to={`/jobs/${job.jobListingId}`}
              className="btn btn-outline-primary"
              style={{ borderRadius: 8 }}
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsList;
