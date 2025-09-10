import React from "react";
import { useForm } from "react-hook-form";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const navigate = useNavigate();

  const postedDate = watch("postedDate");

  const todayDate = new Date().toISOString().split("T")[0];

  const extractDateOnly = (dateTimeString) => {
    if (!dateTimeString) return null;
    return dateTimeString.split("T")[0];
  };

  const onSubmit = async (data) => {
    try {
      const employerId = localStorage.getItem("employerId");
      if (!employerId) {
        alert("No employer profile found");
        return;
      }

      if (data.postedDate && data.postedDate > todayDate) {
        alert("Posted date cannot be a future date.");
        return;
      }

      const payload = {
        employerId: parseInt(employerId),
        title: data.title,
        description: data.description,
        qualification: data.qualification,
        location: data.location,
        companyName: data.companyName || "",
        experience: data.experience ? parseInt(data.experience) : 0,
        requiredSkills: data.requiredSkills || "",
        jobType: data.jobType,
        salary: data.salary ? parseInt(data.salary) : 0,
        active: true,
        postedDate:
          extractDateOnly(data.postedDate) ||
          new Date().toISOString().split("T")[0],
      };

      await api.post("/joblistings", payload);
      alert("Job posted successfully");
      navigate("/employer/dashboard");
    } catch (err) {
      alert("Error posting job: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">Post a New Job</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Title"
            {...register("title", {
              required: "Title is required (3-100 characters)",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
              maxLength: {
                value: 100,
                message: "Title must be 100 characters or less",
              },
            })}
          />
          {errors.title && (
            <small className="text-danger">{errors.title.message}</small>
          )}
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Company Name"
            {...register("companyName", {
              required: "Company Name is required",
              maxLength: {
                value: 150,
                message: "Company Name cannot exceed 150 characters",
              },
            })}
          />
          {errors.companyName && (
            <small className="text-danger">{errors.companyName.message}</small>
          )}
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Location"
            {...register("location", {
              required: "Location is required",
              maxLength: {
                value: 200,
                message: "Location cannot exceed 200 characters",
              },
            })}
          />
          {errors.location && (
            <small className="text-danger">{errors.location.message}</small>
          )}
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Description"
            {...register("description", {
              required: "Description is required (5-500 characters)",
              minLength: {
                value: 5,
                message: "Description must be at least 5 characters",
              },
              maxLength: {
                value: 500,
                message: "Description must be 500 characters or less",
              },
            })}
          />
          {errors.description && (
            <small className="text-danger">{errors.description.message}</small>
          )}
        </div>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Experience (years)"
            {...register("experience", {
              required: "Experience is required",
              min: {
                value: 0,
                message: "Experience must be between 0 and 60 years",
              },
              max: {
                value: 60,
                message: "Experience must be between 0 and 60 years",
              },
            })}
          />
          {errors.experience && (
            <small className="text-danger">{errors.experience.message}</small>
          )}
        </div>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Salary"
            {...register("salary", {
              required: "Salary is required",
              min: {
                value: 0,
                message: "Salary must be a non-negative number",
              },
            })}
          />
          {errors.salary && (
            <small className="text-danger">{errors.salary.message}</small>
          )}
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Qualification"
            {...register("qualification", {
              required: "Qualification is required",
              maxLength: {
                value: 200,
                message: "Qualification cannot exceed 200 characters",
              },
            })}
          />
          {errors.qualification && (
            <small className="text-danger">
              {errors.qualification.message}
            </small>
          )}
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Required Skills"
            {...register("requiredSkills", {
              required: "Required Skills is required",
              maxLength: {
                value: 500,
                message: "Required Skills cannot exceed 500 characters",
              },
              validate: (value) =>
                value.trim().length > 0 || "Required Skills cannot be empty",
            })}
          />
          {errors.requiredSkills && (
            <small className="text-danger">
              {errors.requiredSkills.message}
            </small>
          )}
        </div>
        <div className="mb-3">
          <select
            className="form-control"
            {...register("jobType", { required: "Job Type is required" })}
          >
            <option value="">Select Job Type</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
          {errors.jobType && (
            <small className="text-danger">{errors.jobType.message}</small>
          )}
        </div>
        <div className="mb-3">
          <label>Posted Date</label>
          <input
            type="date"
            className="form-control"
            {...register("postedDate", { required: "Posted Date is required" })}
            max={todayDate}
            defaultValue={postedDate || todayDate}
          />
          {errors.postedDate && (
            <small className="text-danger">{errors.postedDate.message}</small>
          )}
        </div>
        <button className="btn btn-primary">Post Job</button>
      </form>
    </div>
  );
}
