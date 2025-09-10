import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  getJobSeekerById,
  getJobSeekerByUserId,
  createJobSeeker,
  updateJobSeeker,
  verifyUserCredentials,
  deleteUser,
} from "../../api/api";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import yourBackgroundImage from "../../assets/JobSeeker.jpg";

export default function JobSeekerProfile({ onProfileUpdated }) {
  const { user, setUser } = useContext(AuthContext);
  const userId = user?.userId;
  const storedId = user?.jobSeekerId;

  const [loading, setLoading] = useState(true);
  const [existingProfile, setExistingProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const schema = yup.object().shape({
    fullName: yup.string().required("Full Name is required").min(2).max(70),
    email: yup
      .string()
      .required("Email is required")
      .email("Email should be valid"),
    gender: yup
      .string()
      .oneOf(["Male", "Female", "Other"], "Select a valid gender")
      .required("Gender is required"),
    dateOfBirth: yup
      .date()
      .max(new Date(), "Date of Birth cannot be in the future")
      .nullable(true)
      .typeError("Invalid date")
      .required("Date of Birth is required"),
    phone: yup
      .string()
      .matches(/^[6-9]\d{9}$/, "Invalid phone number")
      .required("Valid Phone number is required"),
    address: yup.string().max(150).required("Address is required"),
    education: yup.string().max(100).required("Education is required"),
    skills: yup.string().max(100).required("Skills are required"),
    experience: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .typeError("Please enter a valid experience (number of years)")
      .required("Experience is required")
      .min(0, "Experience must be at least 0 years")
      .max(50, "Experience must not exceed 50 years"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!userId) return;
        const res = storedId
          ? await getJobSeekerById(storedId)
          : await getJobSeekerByUserId(userId);
        if (res?.data) {
          setExistingProfile(res.data);
          Object.keys(res.data).forEach((key) => {
            let val = res.data[key];
            if (key === "dateOfBirth" && val) {
              val = val.split("T")[0];
            }
            if (
              typeof val === "object" &&
              val !== null &&
              key !== "dateOfBirth"
            ) {
              val = JSON.stringify(val);
            }
            setValue(key, val);
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [userId, storedId, setValue]);

  async function onSubmit(data) {
    try {
      if (data.dateOfBirth) {
        if (typeof data.dateOfBirth === "string") {
          data.dateOfBirth = data.dateOfBirth.split("T")[0];
        } else if (data.dateOfBirth instanceof Date) {
          const year = data.dateOfBirth.getFullYear();
          const month = String(data.dateOfBirth.getMonth() + 1).padStart(
            2,
            "0"
          );
          const day = String(data.dateOfBirth.getDate()).padStart(2, "0");
          data.dateOfBirth = `${year}-${month}-${day}`;
        }
      }
      let res;
      if (existingProfile?.jobSeekerId) {
        data.jobSeekerId = existingProfile.jobSeekerId;
        res = await updateJobSeeker(data);
        alert("Job Seeker profile updated successfully");
      } else {
        data.userId = parseInt(userId, 10);
        res = await createJobSeeker(data);
        alert("Job Seeker profile created successfully");
      }
      setExistingProfile(res.data);
      setIsEditing(false);
      if (onProfileUpdated) onProfileUpdated(res.data);

      localStorage.setItem("jobSeekerId", res.data.jobSeekerId);
      setUser((prevUser) => ({
        ...prevUser,
        jobSeekerId: res.data.jobSeekerId,
      }));
    } catch (err) {
      alert(err.response?.data || err.message || "Error saving profile");
    }
  }

  async function handleDeleteAccount(e) {
    e.preventDefault();
    setDeleteError("");
    setDeleting(true);
    try {
      const verifyRes = await verifyUserCredentials({
        email: deleteEmail,
        password: deletePassword,
      });
      if (!verifyRes.data) {
        setDeleteError("Email or password incorrect.");
        setDeleting(false);
        return;
      }
      await deleteUser(userId);
      alert("Account deleted successfully.");
      setUser(null);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      setDeleteError(err.response?.data || "Unexpected error");
      setDeleting(false);
    }
  }

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="spinner-border" role="status" aria-hidden="true"></div>
        <span className="visually-hidden">Loading...</span>
      </div>
    );

  if (!isEditing)
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          backgroundImage: `url(${yourBackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh", maxWidth: 650 }}
        >
          <div className="card shadow p-4" style={{ width: "100%" }}>
            <h3 className="mb-4">Job Seeker Profile</h3>
            <p>
              <strong>Full Name:</strong> {existingProfile?.fullName || "-"}
            </p>
            <p>
              <strong>Email:</strong> {existingProfile?.email || "-"}
            </p>
            <p>
              <strong>Gender:</strong> {existingProfile?.gender || "-"}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {existingProfile?.dateOfBirth || "-"}
            </p>
            <p>
              <strong>Phone:</strong> {existingProfile?.phone || "-"}
            </p>
            <p>
              <strong>Address:</strong> {existingProfile?.address || "-"}
            </p>
            <p>
              <strong>Education:</strong> {existingProfile?.education || "-"}
            </p>
            <p>
              <strong>Skills:</strong> {existingProfile?.skills || "-"}
            </p>
            <p>
              <strong>Experience:</strong> {existingProfile?.experience ?? "-"}
            </p>
            <div className="mt-4">
              <button
                className="btn btn-primary me-2"
                onClick={() => setIsEditing(true)}
              >
                {existingProfile ? "Edit Profile" : "Create Profile"}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </button>
            </div>

            {showDeleteModal && (
              <div
                className="modal d-block"
                tabIndex={-1}
                style={{ background: "rgba(255, 255, 255, 1)" }}
              >
                <div className="modal-dialog">
                  <div className="modal-content p-3">
                    <h5>Confirm Account Deletion</h5>
                    <p>
                      This action is irreversible. Please confirm your email and
                      password.
                    </p>
                    <form onSubmit={handleDeleteAccount}>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={deleteEmail}
                        onChange={(e) => setDeleteEmail(e.target.value)}
                        required
                        autoFocus
                      />
                      <input
                        type="password"
                        className="form-control mt-2"
                        placeholder="Password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        required
                      />
                      {deleteError && (
                        <div className="text-danger mt-2 mb-2">
                          {deleteError}
                        </div>
                      )}
                      <button
                        type="submit"
                        className="btn btn-danger me-2"
                        disabled={deleting}
                      >
                        {deleting ? "Deleting..." : "Delete Account"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={deleting}
                        onClick={() => setShowDeleteModal(false)}
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );

  return (
    <div className="container d-flex justify-content-center align-items-center my-5">
      <div className="card shadow p-4" style={{ maxWidth: 600, width: "100%" }}>
        <h3 className="mb-4">
          {existingProfile ? "Edit Profile" : "Create Profile"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              id="fullName"
              className="form-control"
              {...register("fullName")}
            />
            <small className="text-danger">{errors.fullName?.message}</small>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              {...register("email")}
            />
            <small className="text-danger">{errors.email?.message}</small>
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">
              Gender
            </label>
            <select id="gender" className="form-select" {...register("gender")}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <small className="text-danger">{errors.gender?.message}</small>
          </div>
          <div className="mb-3">
            <label htmlFor="dateOfBirth" className="form-label">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              className="form-control"
              {...register("dateOfBirth")}
            />
            <small className="text-danger">{errors.dateOfBirth?.message}</small>
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input id="phone" className="form-control" {...register("phone")} />
            <small className="text-danger">{errors.phone?.message}</small>
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              id="address"
              className="form-control"
              {...register("address")}
            />
            <small className="text-danger">{errors.address?.message}</small>
          </div>
          <div className="mb-3">
            <label htmlFor="education" className="form-label">
              Education
            </label>
            <input
              id="education"
              className="form-control"
              {...register("education")}
            />
            <small className="text-danger">{errors.education?.message}</small>
          </div>
          <div className="mb-3">
            <label htmlFor="skills" className="form-label">
              Skills
            </label>
            <input
              id="skills"
              className="form-control"
              {...register("skills")}
            />
            <small className="text-danger">{errors.skills?.message}</small>
          </div>
          <div className="mb-3">
            <label htmlFor="experience" className="form-label">
              Experience
            </label>
            <input
              id="experience"
              type="number"
              className="form-control"
              {...register("experience")}
            />
            <small className="text-danger">{errors.experience?.message}</small>
          </div>
          <button
            type="submit"
            className="btn btn-success"
            disabled={isSubmitting}
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
