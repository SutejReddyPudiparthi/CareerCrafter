import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import registerBg from "../assets/Register.jpg";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  userType: yup
    .string()
    .oneOf(["JOBSEEKER", "EMPLOYER"], "Select a valid role")
    .required("Role is required"),
});

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const { confirmPassword, ...submitData } = data;

    try {
      const res = await api.post("/auth/register", data);
      console.log("Register response:", res.data);

      alert("Registration successful. Please login.");
      console.log("Navigating to login page");
      navigate("/login");
    } catch (err) {
      console.log("Registration error:", err);
      let msg = "Registration failed";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          msg = err.response.data;
        } else if (err.response.data.message) {
          msg = err.response.data.message;
        } else {
          msg = JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        msg = err.message;
      }
      alert(msg);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${registerBg})`,
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
        className="card shadow-sm p-4"
        style={{
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          minWidth: 320,
          maxWidth: 400,
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 1)",
        }}
      >
        <h3 className="mb-4">Register</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <input
              {...register("name")}
              className={`form-control${errors.name ? " is-invalid" : ""}`}
              placeholder="Name"
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby="nameError"
            />
            {errors.name && (
              <div id="nameError" className="invalid-feedback">
                {errors.name.message}
              </div>
            )}
          </div>

          <div className="mb-3">
            <input
              {...register("email")}
              className={`form-control${errors.email ? " is-invalid" : ""}`}
              placeholder="Email"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby="emailError"
              type="email"
            />
            {errors.email && (
              <div id="emailError" className="invalid-feedback">
                {errors.email.message}
              </div>
            )}
          </div>

          <div className="mb-3">
            <input
              {...register("password")}
              className={`form-control${errors.password ? " is-invalid" : ""}`}
              placeholder="Password"
              type="password"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby="passwordError"
            />
            {errors.password && (
              <div id="passwordError" className="invalid-feedback">
                {errors.password.message}
              </div>
            )}
          </div>
          <div className="mb-3">
            <input
              {...register("confirmPassword")}
              className={`form-control${
                errors.confirmPassword ? " is-invalid" : ""
              }`}
              placeholder="Confirm Password"
              type="password"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby="confirmPasswordError"
            />
            {errors.confirmPassword && (
              <div id="confirmPasswordError" className="invalid-feedback">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>
          <div className="mb-3">
            <select
              {...register("userType")}
              className={`form-select${errors.userType ? " is-invalid" : ""}`}
              aria-invalid={errors.userType ? "true" : "false"}
              aria-describedby="userTypeError"
            >
              <option value="">Select a role</option>
              <option value="JOBSEEKER">Job Seeker</option>
              <option value="EMPLOYER">Employer</option>
            </select>
            {errors.userType && (
              <div id="userTypeError" className="invalid-feedback">
                {errors.userType.message}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
