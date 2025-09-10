import React, { useEffect, useState } from "react";
import api from "../../api/api";
import ResumeUpload from "./ResumeUpload";

const ResumeManager = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadResumes = async (seekerIdParam) => {
    const seekerId = seekerIdParam || localStorage.getItem("jobSeekerId");
    if (!seekerId) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/resumes/jobseeker/${seekerId}`);
      setResumes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading resumes", err);
      if (err.response?.status !== 404) {
        alert("Error loading resumes: " + (err.response?.data || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSeekerIdAndLoad = async () => {
      let seekerId = localStorage.getItem("jobSeekerId");
      if (!seekerId) {
        try {
          const userId = localStorage.getItem("userId");
          if (!userId) {
            setLoading(false);
            return;
          }
          const res = await api.get(`/jobseekers/user/${userId}`);
          seekerId = res.data.jobSeekerId;
          localStorage.setItem("jobSeekerId", seekerId);
        } catch {
          setLoading(false);
          return;
        }
      }
      loadResumes(seekerId);
    };
    fetchSeekerIdAndLoad();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      await api.delete(`/resumes/${id}`);
      setResumes((prev) => prev.filter((r) => r.resumeId !== id));
      alert("Resume deleted successfully");
    } catch (err) {
      alert("Delete failed: " + (err.response?.data || err.message));
    }
  };

  const handleSetPrimary = async (resumeId) => {
    const updatedResume = resumes.find((r) => r.resumeId === resumeId);
    if (!updatedResume) return;
    try {
      await api.put("/resumes", { ...updatedResume, isPrimary: true });
      const seekerId = localStorage.getItem("jobSeekerId");
      loadResumes(seekerId);
    } catch (err) {
      alert(
        "Failed to set primary resume: " + (err.response?.data || err.message)
      );
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await api.get(`/resumes/download/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = res.headers["content-disposition"];
      let fileName = `resume_${id}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match) fileName = match[1];
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed: " + (err.message || "Unknown error"));
    }
  };

  const handleView = async (id) => {
    try {
      const res = await api.get(`/resumes/download/${id}?inline=true`, {
        responseType: "blob",
      });
      const fileURL = window.URL.createObjectURL(res.data);
      window.open(fileURL, "_blank");
    } catch (err) {
      console.error(err);
      alert("View failed: " + (err.message || "Unknown error"));
    }
  };

  if (loading) {
    return (
      <div className="container my-4" style={{ maxWidth: 700 }}>
        <h2>My Resumes</h2>
        <p>Loading resumes...</p>
      </div>
    );
  }

  const seekerId = localStorage.getItem("jobSeekerId");
  if (!seekerId) {
    return (
      <div className="container my-4" style={{ maxWidth: 700 }}>
        <h2>My Resumes</h2>
        <div className="alert alert-warning">
          <p>
            You need to create your Job Seeker profile first before uploading
            resumes.
          </p>
          <p>
            Please go to <strong>My Profile</strong> and create your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4" style={{ maxWidth: 700 }}>
      <h2>My Resumes</h2>
      <ResumeUpload onUploaded={loadResumes} />
      <div className="mt-4">
        {!resumes || resumes.length === 0 ? (
          <p>
            No resumes uploaded yet. Upload your first resume using the form
            above.
          </p>
        ) : (
          <ul className="list-unstyled">
            {resumes.map((r) => (
              <li
                key={r.resumeId}
                className="border rounded p-3 mb-3 shadow-sm"
              >
                <p>
                  <b>File:</b> {r.filePath}
                </p>
                <div></div>
                <div className="btn-group" role="group">
                  <button
                    className="btn btn-outline-success me-2"
                    onClick={() => handleView(r.resumeId)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => handleDownload(r.resumeId)}
                  >
                    Download
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleDelete(r.resumeId)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResumeManager;
