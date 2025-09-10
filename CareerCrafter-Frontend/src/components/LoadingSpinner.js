import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div
        className="spinner-border text-primary"
        role="status"
        aria-label="Loading"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
