import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { FaSearch } from "react-icons/fa";
import logo from "../assets/Brand_Logo.png";

const Navbar = () => {
  const { user, logout, loadingUser } = useContext(AuthContext);
  const isLoggedIn = user?.loggedIn || false;
  const role = user?.role || "";
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (user.role === "EMPLOYER") {
      navigate(`/employer/jobs?query=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate(`/jobs?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  if (loadingUser) {
    return (
      <nav
        className="navbar d-flex align-items-center px-4"
        style={{
          background: "#fff",
          justifyContent: "space-between",
          height: 70,
        }}
      ></nav>
    );
  }

  return (
    <nav
      className="navbar d-flex align-items-center px-4"
      style={{
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        minHeight: "76px",
      }}
    >
      <Link
        to="/"
        style={{
          fontWeight: "700",
          fontSize: "1.5em",
          color: "#1976d2",
          textDecoration: "none",
        }}
      >
        <img
          src={logo}
          alt="CareerCrafter Logo"
          style={{
            height: "48px",
            maxHeight: "70px",
            width: "auto",
            objectFit: "contain",
            marginRight: "10px",
            display: "block",
          }}
        />
      </Link>

      <form
        onSubmit={handleSearch}
        style={{
          flex: 2,
          display: "flex",
          justifyContent: "center",
        }}
        autoComplete="off"
      >
        <div
          style={{
            position: "relative",
            width: 420,
            maxWidth: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaSearch
            style={{
              position: "absolute",
              left: 18,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#1976d2",
              fontSize: "1.29em",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, location, company, required skills"
            className="form-control"
            style={{
              width: "100%",
              borderRadius: "2em",
              paddingLeft: "2.5em",
              paddingRight: "3em",
              fontSize: "1em",
              boxShadow: searchFocus
                ? "0 0 0 3px rgba(25, 118, 210, 0.18)"
                : "0 2px 8px rgba(0,0,0,0.10)",
              border: searchFocus ? "1.5px solid #1976d2" : "1px solid #eaeaea",
              background: "#fafafb",
              transition: "box-shadow 0.3s, border 0.2s",
              outline: "none",
              height: "45px",
            }}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
          />
        </div>
      </form>

      <div
        className="nav-links d-flex align-items-center"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        {!isLoggedIn && (
          <>
            <Link
              to="/login"
              style={{
                fontSize: "1.15rem",
                padding: "8px 18px",
                color: "#1976d2",
                textDecoration: "none",
                fontWeight: "700",
                borderRadius: "22px",
                transition: "background 0.2s",
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                fontSize: "1.15rem",
                padding: "8px 18px",
                color: "#1976d2",
                textDecoration: "none",
                fontWeight: "700",
                borderRadius: "22px",
                transition: "background 0.2s",
              }}
            >
              Register
            </Link>
          </>
        )}

        {isLoggedIn && role === "JOBSEEKER" && (
          <>
            <Link to="/profile/jobseeker">My Profile</Link>
            <Link to="/jobs">Job Listings</Link>
            <Link to="/my-applications">My Applications</Link>
            <Link to="/jobseeker/dashboard">Dashboard</Link>
            <button
              onClick={logout}
              style={{
                marginLeft: "1rem",
                padding: "0.35rem 0.7rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#1976d2",
                color: "white",
                cursor: "pointer",
              }}
              aria-label="Logout"
            >
              {" "}
              Logout
            </button>
          </>
        )}

        {isLoggedIn && role === "EMPLOYER" && (
          <>
            <Link to="/profile/employer">Employer Profile</Link>
            <Link to="/employer/dashboard">Dashboard</Link>
            <Link to="/employer/post-job">Post a Job</Link>
            <Link to="/applications/employer">Employer Applications</Link>
            <button
              onClick={logout}
              style={{
                marginLeft: "1rem",
                padding: "0.35rem 0.7rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#1976d2",
                color: "white",
                cursor: "pointer",
              }}
              aria-label="Logout"
            >
              {" "}
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
