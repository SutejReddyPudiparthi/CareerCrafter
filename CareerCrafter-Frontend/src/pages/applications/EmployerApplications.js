import React, { useEffect, useState } from "react";
import api from "../../api/api";
import LoadingSpinner from "../../components/LoadingSpinner";
const STATUS_OPTIONS = [
  "APPLIED",
  "IN_REVIEW",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
];
export default function EmployerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ id: null, status: null });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedJobSeekerId, setSelectedJobSeekerId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const employerId = localStorage.getItem("employerId");
        if (!employerId) return;
        const jobsRes = await api.get("/joblistings");
        const employerJobs = jobsRes.data.filter(
          (j) => j.employerId === parseInt(employerId)
        );
        const jobIds = new Set(employerJobs.map((j) => j.jobListingId));
        const appsRes = await api.get("/applications");
        let apps = appsRes.data.filter((a) => jobIds.has(a.jobListingId));
        const seekerIds = [
          ...new Set(apps.map((a) => a.seekerId || a.jobSeekerId)),
        ];
        // Updated: Map resumes by seeker ID with array of resumes
        const resumeMap = {};
        for (const sId of seekerIds) {
          const resumesRes = await api.get(`/resumes/jobseeker/${sId}`);
          resumeMap[sId] = resumesRes.data; // array of resumes for seeker
        }
        const seekersMap = {};
        for (const sId of seekerIds) {
          try {
            const seekerRes = await api.get(`/jobseekers/${sId}`);
            seekersMap[sId] = seekerRes.data;
          } catch (err) {
            seekersMap[sId] = null;
          }
        }
        // Updated: Map applications adding correct resumeId from primary resume or first
        apps = apps.map((app) => {
          const job = employerJobs.find(
            (j) => j.jobListingId === app.jobListingId
          );
          const seeker = seekersMap[app.seekerId || app.jobSeekerId];
          const seekerId = app.seekerId || app.jobSeekerId;
          const resumes = resumeMap[seekerId] || [];
          const primaryResume = resumes.find((r) => r.primary) || resumes[0];
          const resumeId = primaryResume ? primaryResume.resumeId : null;
          return {
            ...app,
            jobTitle: app.jobTitle || (job ? job.title : "-"),
            applicantName:
              app.applicantName || (seeker ? seeker.fullName : "-"),
            resumeId: resumeId,
          };
        });
        setApplications(apps);
      } catch (err) {
        console.error("Error loading applications", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  // rest of your code remains unchanged
  useEffect(() => {
    if (showProfileModal && selectedJobSeekerId) {
      const fetchProfile = async () => {
        setProfileLoading(true);
        setProfileError(null);
        try {
          const res = await api.get(`/jobseekers/${selectedJobSeekerId}`);
          setProfile(res.data);
        } catch (err) {
          setProfileError("Error loading job seeker profile.");
        } finally {
          setProfileLoading(false);
        }
      };
      fetchProfile();
    } else {
      setProfile(null);
      setProfileError(null);
    }
  }, [showProfileModal, selectedJobSeekerId]);
  const handleStatusSelect = (id, status) => {
    setStatusUpdate({ id, status });
  };
  const updateStatus = async () => {
    const { id, status } = statusUpdate;
    if (!id || !status) return;
    const app = applications.find((a) => a.applicationId === id);
    if (!app) return;
    const payload = {
      applicationId: app.applicationId,
      jobListingId: app.jobListingId,
      jobSeekerId: app.jobSeekerId,
      status: status,
      resumeFilePath: app.resumeFilePath || "",
      jobTitle: app.jobTitle || "",
      applicantName: app.applicantName || "",
      applicationDate: app.applicationDate,
    };
    try {
      await api.put("/applications", payload);
      setApplications((apps) =>
        apps.map((a) => (a.applicationId === id ? { ...a, status } : a))
      );
      setStatusUpdate({ id: null, status: null });
    } catch (err) {
      alert(
        `Error ${err.response?.status}: ${err.response?.data || err.message}`
      );
    }
  };
  const viewResume = async (resumeId) => {
    try {
      const res = await api.get(`/resumes/download/${resumeId}?inline=true`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(res.data);
      window.open(url, "_blank");
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Error ${err.response?.status}: ${err.response?.statusText}`);
    }
  };
  const viewProfile = (jobSeekerId) => {
    setSelectedJobSeekerId(jobSeekerId);
    setShowProfileModal(true);
  };
  const closeProfileModal = () => {
    setSelectedJobSeekerId(null);
    setShowProfileModal(false);
  };
  if (loading) return <LoadingSpinner />;
  return (
    <div className="container my-4" style={{ maxWidth: "900px" }}>
      <h3>Applications To Your Jobs</h3>
      {applications.length === 0 && <p>No applications found.</p>}
      {applications.map((app) => (
        <div
          key={app.applicationId}
          className="card p-3 mb-4 shadow-sm"
          style={{ borderRadius: 12, cursor: "default" }}
        >
          <div className="d-flex justify-content-between align-items-start flex-column flex-md-row">
            <div>
              <h5 style={{ color: "#1976d2" }}>
                Application #{app.applicationId}
              </h5>
              <p>
                <b>Job Title:</b> {app.jobTitle || "-"}
              </p>
              <p>
                <b>Applicant Name:</b> {app.applicantName || "-"}
              </p>
              <p>
                <b>Job ID:</b> {app.jobListingId}
              </p>
              <p>
                <b>Job Seeker ID:</b> {app.jobSeekerId}
              </p>
              <p>
                <b>Status:</b> {app.status}
              </p>
              <div className="mt-3">
                <button
                  className="btn btn-outline-info me-2"
                  onClick={() => viewProfile(app.jobSeekerId)}
                >
                  View Profile
                </button>
                {app.resumeId && (
                  <>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => viewResume(app.resumeId)}
                    >
                      View Resume
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="mt-3 mt-md-0">
              <select
                className="form-select form-select-sm"
                value={
                  statusUpdate.id === app.applicationId
                    ? statusUpdate.status || app.status
                    : app.status
                }
                onChange={(e) =>
                  handleStatusSelect(app.applicationId, e.target.value)
                }
                aria-label={`Change status for application ${app.applicationId}`}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {statusUpdate.id === app.applicationId &&
                statusUpdate.status &&
                statusUpdate.status !== app.status && (
                  <button
                    className="btn btn-success btn-sm mt-2"
                    onClick={updateStatus}
                  >
                    Confirm Status
                  </button>
                )}
            </div>
          </div>
        </div>
      ))}
      {showProfileModal && selectedJobSeekerId && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Job Seeker Profile (ID: {selectedJobSeekerId})
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeProfileModal}
                />
              </div>
              <div className="modal-body">
                {profileLoading && <div>Loading...</div>}
                {profileError && (
                  <div className="text-danger">{profileError}</div>
                )}
                {profile && (
                  <div>
                    <b>Name:</b> {profile.fullName}
                    <br />
                    <b>Email:</b> {profile.email}
                    <br />
                    <b>Phone:</b> {profile.phone}
                    <br />
                    <b>Education:</b> {profile.education}
                    <br />
                    <b>Experience:</b> {profile.experience}
                    <br />
                    <b>Skills:</b> {profile.skills}
                    <br />
                    <b>Gender:</b> {profile.gender}
                    <br />
                    <b>Date of Birth:</b> {profile.dateOfBirth}
                    <br />
                    <b>Address:</b> {profile.address}
                    <br />
                  </div>
                )}
                {!profileLoading && !profileError && !profile && (
                  <div>No profile data found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
