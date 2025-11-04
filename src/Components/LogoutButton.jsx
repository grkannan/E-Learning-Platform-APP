// src/components/LogoutButton.jsx
import React from "react";

const LogoutButton = () => {
  const handleLogout = () => {
    // Optional: Add API call to invalidate refresh token
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user"); // if stored
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
