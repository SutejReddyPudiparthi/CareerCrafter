import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/api";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const employerId = parseInt(localStorage.getItem("employerId"));
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("query")?.toLowerCase().trim() || "";

  const loadDashboard = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get("/joblistings"),
        api.get("/applications"),
      ]);

      const activeJobs = jobsRes.data.filter((job) => job.active);
      if (showAllJobs) {
        setJobs(activeJobs);
      } else {
        setJobs(activeJobs.filter((job) => job.employerId === employerId));
      }
      const myJobIds = new Set(
        activeJobs
          .filter((job) => job.employerId === employerId)
          .map((job) => job.jobListingId)
      );
      const filteredApps = appsRes.data.filter((app) =>
        myJobIds.has(app.jobListingId)
      );
      setApps(filteredApps);
    } catch (err) {
      console.error("Error loading dashboard", err);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [showAllJobs]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const extractDateOnly = (dateString) => {
    if (!dateString) return null;
    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }
    return dateString;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await api.delete(`/joblistings/${id}`);
      setJobs((prev) => prev.filter((job) => job.jobListingId !== id));
      setSelectedJob(null);
    } catch (error) {
      alert("Failed to delete job: " + (error.response?.data || error.message));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editJob,
        employerId,
        postedDate:
          extractDateOnly(editJob.postedDate) ||
          new Date().toISOString().split("T")[0],
      };
      const res = await api.put("/joblistings", payload);
      setJobs((prev) =>
        prev.map((job) =>
          job.jobListingId === res.data.jobListingId ? res.data : job
        )
      );
      setEditJob(null);
      setSelectedJob(null);
    } catch (error) {
      alert("Failed to update: " + (error.response?.data || error.message));
    }
  };

  const toggleExpandedJob = (id) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  const filteredJobs = (
    showAllJobs ? jobs : jobs.filter((job) => job.employerId === employerId)
  ).filter((job) => {
    if (!searchQuery) return true;
    return (
      job.title?.toLowerCase().includes(searchQuery) ||
      job.location?.toLowerCase().includes(searchQuery) ||
      job.companyName?.toLowerCase().includes(searchQuery) ||
      job.requiredSkills?.toLowerCase().includes(searchQuery)
    );
  });

  return (
    <div className="container my-4" style={{ maxWidth: "900px" }}>
      <h2 className="mb-4">Employer Dashboard</h2>

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary"
          onClick={() => setShowAllJobs(!showAllJobs)}
        >
          {showAllJobs ? "Show My Jobs" : "Show All Jobs"}
        </button>
      </div>

      <h3 className="mb-3">{showAllJobs ? "All Jobs" : "My Job Listings"}</h3>

      <div>
        {filteredJobs.map((job) => (
          <div
            key={job.jobListingId}
            className="card p-3 mb-3 shadow-sm"
            style={{
              borderRadius: "12px",
              cursor: "pointer",
              transition: "box-shadow 0.3s ease",
              position: "relative",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            onClick={() => toggleExpandedJob(job.jobListingId)}
          >
            <div className="d-flex justify-content-between align-items-center">
              <span style={{ fontWeight: 600, color: "#1976d2" }}>
                {job.title} - {job.location}
              </span>
              <div>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedJob(job);
                  }}
                >
                  View
                </button>
                {job.employerId === employerId && (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditJob(job);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(job.jobListingId);
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {expandedJobId === job.jobListingId && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f4f7fb",
                  borderRadius: "8px",
                  border: "1px solid #d3dff0",
                  color: "#444",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <p>
                  <b>Company:</b> {job.companyName}
                </p>
                <p>
                  <b>Description:</b> {job.description}
                </p>
                <p>
                  <b>Qualification:</b> {job.qualification}
                </p>
                <p>
                  <b>Location:</b> {job.location}
                </p>
                <p>
                  <b>Experience:</b> {job.experience}
                </p>
                <p>
                  <b>Salary:</b> {job.salary}
                </p>
                <p>
                  <b>Posted Date:</b> {formatDate(job.postedDate)}
                </p>
                <p>
                  <b>Required Skills:</b>{" "}
                  {job.requiredSkills || "Not specified"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedJob && !editJob && (
        <div
          className="card p-3 mt-3 shadow-sm"
          style={{ borderRadius: "12px" }}
        >
          <h4 style={{ color: "#1976d2" }}>{selectedJob.title}</h4>
          <p>
            <b>Company:</b> {selectedJob.companyName}
          </p>
          <p>
            <b>Description:</b> {selectedJob.description}
          </p>
          <p>
            <b>Qualification:</b> {selectedJob.qualification}
          </p>
          <p>
            <b>Location:</b> {selectedJob.location}
          </p>
          <p>
            <b>Experience:</b> {selectedJob.experience}
          </p>
          <p>
            <b>Salary:</b> {selectedJob.salary}
          </p>
          <p>
            <b>Posted Date:</b> {formatDate(selectedJob.postedDate)}
          </p>
          <p>
            <b>Required Skills:</b>{" "}
            {selectedJob.requiredSkills || "Not specified"}
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => setSelectedJob(null)}
          >
            Close
          </button>
        </div>
      )}

      {editJob && (
        <div
          className="card p-3 mt-3 shadow-sm"
          style={{ borderRadius: "12px" }}
        >
          <h4 style={{ color: "#1976d2" }}>Edit Job</h4>
          <form onSubmit={handleEditSubmit} className="d-flex flex-column">
            <input
              className="form-control mb-3"
              value={editJob.title}
              onChange={(e) =>
                setEditJob({ ...editJob, title: e.target.value })
              }
              required
            />
            <input
              className="form-control mb-3"
              value={editJob.companyName || ""}
              onChange={(e) =>
                setEditJob({ ...editJob, companyName: e.target.value })
              }
              placeholder="Company Name"
            />
            <textarea
              className="form-control mb-3"
              value={editJob.description}
              onChange={(e) =>
                setEditJob({ ...editJob, description: e.target.value })
              }
              required
            />
            <input
              className="form-control mb-3"
              value={editJob.qualification}
              onChange={(e) =>
                setEditJob({ ...editJob, qualification: e.target.value })
              }
              required
            />
            <input
              className="form-control mb-3"
              value={editJob.location}
              onChange={(e) =>
                setEditJob({ ...editJob, location: e.target.value })
              }
              required
            />
            <input
              className="form-control mb-3"
              value={editJob.requiredSkills || ""}
              onChange={(e) =>
                setEditJob({ ...editJob, requiredSkills: e.target.value })
              }
              placeholder="Required Skills"
              required
            />
            <input
              className="form-control mb-3"
              value={editJob.experience}
              onChange={(e) =>
                setEditJob({ ...editJob, experience: e.target.value })
              }
              type="number"
              min={0}
              max={60}
            />
            <input
              className="form-control mb-3"
              value={editJob.salary}
              onChange={(e) =>
                setEditJob({ ...editJob, salary: e.target.value })
              }
              type="number"
              min={0}
            />
            <select
              className="form-control mb-3"
              value={editJob.jobType}
              onChange={(e) =>
                setEditJob({ ...editJob, jobType: e.target.value })
              }
              required
            >
              <option value="">Select Job Type</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
            <label>Posted Date</label>
            <input
              type="date"
              className="form-control"
              value={
                editJob.postedDate ? extractDateOnly(editJob.postedDate) : ""
              }
              onChange={(e) =>
                setEditJob({ ...editJob, postedDate: e.target.value })
              }
              max={new Date().toISOString().split("T")[0]}
            />
            <div className="d-flex">
              <button type="submit" className="btn btn-primary me-2">
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditJob(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <h3 className="mt-4 mb-3">Applications</h3>
      <ul className="list-group">
        {apps.map((app) => (
          <li key={app.applicationId} className="list-group-item">
            Job {app.jobListingId} → Seeker {app.jobSeekerId} (Status:{" "}
            {app.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployerDashboard;
