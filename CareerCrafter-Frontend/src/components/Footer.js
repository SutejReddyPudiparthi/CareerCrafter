import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#fafafa",
        borderTop: "1px solid #dee2e6",
        fontSize: "0.85rem",
        padding: "6px 0",
        color: "#6c757d",
        maxWidth: 480,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <Link
          to="/"
          className="text-muted text-decoration-none"
          style={{ fontWeight: 500 }}
        >
          Home
        </Link>
        <span>·</span>
        <Link
          to="/login"
          className="text-muted text-decoration-none"
          style={{ fontWeight: 500 }}
        >
          Login
        </Link>
        <span>·</span>
        <Link
          to="/register"
          className="text-muted text-decoration-none"
          style={{ fontWeight: 500 }}
        >
          Register
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.6rem",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#34495e",
          }}
        >
          CareerCrafter
        </span>
      </div>

      <div
        style={{
          marginTop: "2px",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "#868e96",
          userSelect: "none",
        }}
      >
        © {new Date().getFullYear()} CareerCrafter. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
