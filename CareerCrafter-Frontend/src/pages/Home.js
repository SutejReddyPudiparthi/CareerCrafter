import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaBriefcase,
  FaSearch,
  FaUserTie,
  FaFileUpload,
  FaCheckCircle,
} from "react-icons/fa";
import backgroundImg from "../assets/Home.jpg";

const steps = [
  {
    icon: <FaUserTie style={{ fontSize: "2rem", color: "#1976d2" }} />,
    text: "Register / Signup",
  },
  {
    icon: <FaFileUpload style={{ fontSize: "2rem", color: "#1976d2" }} />,
    text: "Upload Your Resume",
  },
  {
    icon: <FaSearch style={{ fontSize: "2rem", color: "#1976d2" }} />,
    text: "Find & Apply for Jobs",
  },
  {
    icon: <FaCheckCircle style={{ fontSize: "2rem", color: "#1976d2" }} />,
    text: "Get Hired!",
  },
];

export default function Home() {
  const [infoVisible, setInfoVisible] = useState(false);
  const infoCardRef = useRef(null);

  const toggleInfoCard = () => {
    setInfoVisible(!infoVisible);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (infoCardRef.current && !infoCardRef.current.contains(event.target)) {
        setInfoVisible(false);
      }
    }
    if (infoVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [infoVisible]);

  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: "90vh",
        background: "#f8f9fa",
        padding: "2rem 1rem",
        backgroundImage: `url(${backgroundImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "1.5rem",
          marginBottom: "1.2rem",
        }}
      >
        <span
          style={{
            background: "rgba(255,255,255,0.97)",
            padding: "0.8rem 2.2rem",
            borderRadius: "14px",
            boxShadow: "0 2px 12px rgba(44,62,80,0.11)",
            fontWeight: 700,
            fontSize: "2.8rem",
            color: "#173355",
            textAlign: "center",
            letterSpacing: "0.02em",
            lineHeight: 1.15,
          }}
        >
          Welcome to CareerCrafter
        </span>
        <span
          style={{
            background: "rgba(255,255,255,0.92)",
            padding: "0.5rem 1.3rem",
            borderRadius: "10px",
            fontWeight: 500,
            fontSize: "1.18rem",
            color: "#1976d2",
            marginTop: "1rem",
            textAlign: "center",
            display: "block",
            letterSpacing: "0.01em",
          }}
        >
          Find the best jobs or hire top talent with ease.
        </span>
      </div>

      <Link
        to="/jobs"
        className="btn btn-primary btn-lg mb-5 px-4 py-2 rounded-pill shadow-sm"
        style={{ fontWeight: "500", letterSpacing: "0.02em" }}
      >
        Browse Jobs
      </Link>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          maxWidth: 660,
          margin: "0 auto 2.5rem",
        }}
      >
        <div
          className="card shadow-sm p-3 d-flex flex-column align-items-center justify-content-center text-center"
          style={{
            width: "320px",
            minHeight: "190px",
            borderRadius: "14px",
            background: "#fff",
            boxSizing: "border-box",
          }}
        >
          <FaUser size={40} color="#2471A3" />
          <h5 className="mt-3 mb-2" style={{ color: "#34495E" }}>
            For Job Seekers
          </h5>
          <ul
            className="list-unstyled mb-0"
            style={{ fontSize: "1rem", color: "#566573", paddingLeft: 0 }}
          >
            <li>✔ Easy application process</li>
            <li>✔ Personalized job recommendations</li>
            <li>✔ Resume upload & tracking</li>
          </ul>
        </div>

        <div
          className="card shadow-sm p-3 d-flex flex-column align-items-center justify-content-center text-center"
          style={{
            width: "320px",
            minHeight: "190px",
            borderRadius: "14px",
            background: "#fff",
            boxSizing: "border-box",
          }}
        >
          <FaBriefcase size={40} color="#2471A3" />
          <h5 className="mt-3 mb-2" style={{ color: "#34495E" }}>
            For Employers
          </h5>
          <ul
            className="list-unstyled mb-0"
            style={{ fontSize: "1rem", color: "#566573", paddingLeft: 0 }}
          >
            <li>✔ Post jobs easily</li>
            <li>✔ Manage Applications</li>
            <li>✔ Analytics dashboard</li>
          </ul>
        </div>
      </div>

      <section
        style={{
          width: "100%",
          maxWidth: 900,
          marginBottom: "3rem",
          background: "#f8faff",
          borderRadius: 20,
          padding: "2rem 1rem",
          boxShadow: "0 1px 6px rgba(25,118,210,0.07)",
        }}
      >
        <h2
          style={{
            color: "#1976d2",
            marginBottom: "1.4rem",
            textAlign: "center",
            fontWeight: "700",
          }}
        >
          How CareerCrafter Works
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          {steps.map((step, idx) => (
            <div key={idx} style={{ textAlign: "center", minWidth: 110 }}>
              <div>{step.icon}</div>
              <div
                style={{
                  marginTop: 7,
                  color: "#1976d2",
                  fontWeight: "500",
                  fontSize: "1.01rem",
                }}
              >
                {step.text}
              </div>
              {idx < steps.length - 1 && (
                <div
                  style={{
                    margin: "0 auto",
                    width: 30,
                    height: 12,
                    borderBottom: "2px dashed #1976d2",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      <button
        onClick={toggleInfoCard}
        style={{
          padding: "12px 28px",
          fontSize: "1.15rem",
          fontWeight: "700",
          color: "#fff",
          backgroundColor: "#1976d2",
          border: "none",
          borderRadius: "30px",
          cursor: "pointer",
          boxShadow: "0 6px 10px rgba(25, 118, 210, 0.3)",
          transition: "transform 0.25s ease, background-color 0.25s ease",
          marginBottom: "2rem",
          userSelect: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#1565c0";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#1976d2";
          e.currentTarget.style.transform = "scale(1)";
        }}
        aria-expanded={infoVisible}
        aria-controls="career-info-card"
      >
        About CareerCrafter
      </button>

      {infoVisible && (
        <div
          ref={infoCardRef}
          id="career-info-card"
          role="region"
          aria-live="polite"
          style={{
            maxWidth: 600,
            backgroundColor: "#fff",
            boxShadow: "0 8px 20px rgba(25,118,210,0.15)",
            borderRadius: 12,
            padding: "1.8rem 2rem",
            color: "#34495e",
            fontSize: "1.05rem",
            lineHeight: 1.5,
            textAlign: "center",
            userSelect: "text",
            marginBottom: "2rem",
          }}
        >
          <h3 style={{ color: "#1976d2", marginBottom: "1rem" }}>
            What is CareerCrafter?
          </h3>
          <p>
            CareerCrafter is your one-stop platform to find the best job
            opportunities. If you are a job seeker looking for personalized
            recommendations or an employer seeking skilled talent, CareerCrafter
            helps in hiring process with an easy-to-use interface, resume
            management. Empower your job search or recruitment journey today!
          </p>
        </div>
      )}

      <div
        className="card shadow-sm p-4 mt-4"
        style={{
          minWidth: 340,
          maxWidth: 430,
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        <p>
          Already registered?{" "}
          <Link
            to="/login"
            style={{ textDecoration: "underline", color: "#1976d2" }}
          >
            Login here
          </Link>
        </p>
        <p>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ textDecoration: "underline", color: "#1976d2" }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
