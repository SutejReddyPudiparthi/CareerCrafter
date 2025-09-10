import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import { AuthContext } from "../../auth/AuthContext";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [file, setFile] = useState(null);
  const [cover, setCover] = useState("");
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const { user } = useContext(AuthContext);

  const jobId = Number(id);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchJob = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/joblistings/${jobId}`);
      setJob(res.data);
    } catch (err) {
      alert(
        "Job not found: " + JSON.stringify(err.response?.data || err.message)
      );
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  const checkIfApplied = useCallback(async () => {
    try {
      const res = await api.get(`/applications/jobseeker/${user.jobSeekerId}`);
      const alreadyApplied = res.data.some((a) => a.jobListingId === jobId);
      setApplied(alreadyApplied);
    } catch (err) {
      console.error("Check application failed:", err);
    }
  }, [jobId, user]);

  const fetchResumes = useCallback(async () => {
    try {
      const res = await api.get(`/resumes/jobseeker/${user.jobSeekerId}`);
      setResumes(res.data);
      const primary = res.data.find((r) => r.isPrimary);
      if (primary) setSelectedResumeId(primary.resumeId.toString());
    } catch (err) {
      console.error("Error fetching resumes", err);
    }
  }, [user]);

  useEffect(() => {
    fetchJob();
    if (user?.jobSeekerId) {
      checkIfApplied();
      fetchResumes();
    }
  }, [jobId, user, fetchJob, checkIfApplied, fetchResumes]);

  async function uploadResumeAndApply(e) {
    e.preventDefault();

    if (!user) {
      return alert("Login as Job Seeker");
    }

    if (!user.jobSeekerId) {
      return alert(
        "Profile not created. Please create your job seeker profile first."
      );
    }

    try {
      let resumeFilePath = "";

      if (file) {
        const fd = new FormData();
        fd.append("jobSeekerId", user.jobSeekerId);
        fd.append("file", file);
        const uploadRes = await api.post("/resumes/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        resumeFilePath = uploadRes.data.filePath;
      } else if (selectedResumeId) {
        const res = await api.get(`/resumes/${selectedResumeId}`);
        resumeFilePath = res.data.filePath;
      } else {
        return alert("Please upload or select a resume");
      }

      console.log("Applying job, user before apply:", user);
      await api.post("/applications", {
        jobListingId: jobId,
        jobSeekerId: user.jobSeekerId,
        status: "APPLIED",
        resumeFilePath,
        applicationDate: new Date().toISOString(),
      });
      alert("Applied successfully");
      setApplied(true);
    } catch (err) {
      alert("Apply failed: " + (err.response?.data || err.message));
    }
  }

  if (loading || !user) return <LoadingSpinner />;

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/joblistings/${jobId}`);
      alert("Job deleted successfully");
      navigate("/jobs");
    } catch (err) {
      alert("Delete failed: " + (err.response?.data || err.message));
    }
  }

  async function handleUpdate() {
    const newTitle = prompt("Enter new job title:", job.title);
    if (!newTitle || newTitle === job.title) return;
    try {
      const updated = { ...job, title: newTitle };
      const res = await api.put(`/joblistings/${jobId}`, updated);
      setJob(res.data);
      alert("Job updated successfully");
    } catch (err) {
      alert("Update failed: " + (err.response?.data || err.message));
    }
  }

  if (!job) return <div>Job not found</div>;

  const isJobSeeker = user.role === "JOBSEEKER" && !!user.jobSeekerId;
  const isEmployer =
    user.role === "EMPLOYER" && user.employerId === job.employerId;

  return (
    <div className="container my-4" style={{ maxWidth: "700px" }}>
      {isJobSeeker && (
        <button
          type="button"
          onClick={() => navigate("/jobs")}
          style={{
            marginBottom: "1em",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "7px",
            padding: "7px 21px",
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(25,118,210,0.09)",
          }}
        >
          ← Back to Job Listings
        </button>
      )}
      <div className="card shadow-sm p-4" style={{ borderRadius: 12 }}>
        <h3 style={{ color: "#1976d2", marginBottom: "1rem" }}>{job.title}</h3>
        <p>{job.description}</p>
        <p>
          <b>Company:</b> {job.companyName}
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
          <b>Required Skills:</b> {job.requiredSkills}
        </p>
        <p>
          <b>Salary:</b> {job.salary}
        </p>
        <p>
          <b>Job Type:</b> {job.jobType}
        </p>
        <p>
          <b>Posted Date:</b> {formatDate(job.postedDate)}
        </p>

        {isEmployer && (
          <div className="mb-3">
            <button className="btn btn-warning me-2" onClick={handleUpdate}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}

        {isJobSeeker && !applied ? (
          <div className="card mt-3 p-3 shadow">
            <h5>Apply for this job</h5>
            <form onSubmit={uploadResumeAndApply}>
              {resumes.length > 0 && (
                <div className="mb-3">
                  <label htmlFor="resumeSelect" className="form-label">
                    Select Existing Resume
                  </label>
                  <select
                    id="resumeSelect"
                    className="form-select"
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                  >
                    <option value="">-- Select Resume --</option>
                    {resumes.map((r) => (
                      <option key={r.resumeId} value={r.resumeId.toString()}>
                        {r.isPrimary ? "⭐ " : ""}
                        {r.filePath}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="uploadResume" className="form-label">
                  Or Upload New Resume
                </label>
                <input
                  id="uploadResume"
                  type="file"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="coverLetter" className="form-label">
                  Cover letter (optional)
                </label>
                <textarea
                  id="coverLetter"
                  className="form-control"
                  placeholder="Cover letter (optional)"
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-success">
                Apply
              </button>
            </form>
          </div>
        ) : isJobSeeker && applied ? (
          <button
            className="btn btn-primary mt-3"
            onClick={async () => {
              try {
                const res = await api.get(
                  `/applications/jobseeker/${user.jobSeekerId}`
                );
                const app = res.data.find((a) => a.jobListingId === jobId);
                if (app) {
                  navigate(`/my-applications?select=${app.applicationId}`);
                } else {
                  alert("Application details not found.");
                }
              } catch {
                alert("Error fetching application status.");
              }
            }}
          >
            View Status
          </button>
        ) : (
          <div className="alert alert-info mt-3">
            Create a profile to apply.
          </div>
        )}
      </div>
    </div>
  );
}
