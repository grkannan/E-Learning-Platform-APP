import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const InstructorCard = ({ instructor, onStatusChange }) => {
  const [isActive, setIsActive] = useState(
    instructor.is_active !== undefined ? instructor.is_active : true
  );

  const fullName =
    (instructor.first_name || "") + " " + (instructor.last_name || "") || instructor.username;

  const photo = instructor.profile_picture
    ? "http://127.0.0.1:8000" + instructor.profile_picture
    : "/default-profile.png";
    console.log(photo);
  // 🔁 Fetch latest status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axiosInstance.get(`/api/instructors/${instructor.id}/`);
        const latestStatus = res.data.is_active;
        setIsActive(latestStatus);
      } catch (err) {
        console.error("Error fetching instructor status", err);
      }
    };

    fetchStatus();
  }, [instructor.id]);

  // 🔁 Toggle disable/enable
  const handleToggle = async () => {
    try {
      const res = await axiosInstance.post(
        `/api/instructors/${instructor.id}/toggle-status/`
      );
      const newStatus = res.data.is_active;
      setIsActive(newStatus);
      onStatusChange(instructor.id, newStatus); // Optional callback to parent
    } catch (err) {
      console.error("Error toggling instructor status", err);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition duration-300">
      <img
        src={photo}
        alt="Instructor"
        className="w-24 h-24 mx-auto rounded-full object-cover border border-gray-300 mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-800">{fullName}</h3>
      <p className="text-sm text-gray-500 mt-1 mb-4">{instructor.bio || "Department"}</p>

      <button
        onClick={handleToggle}
        className={`${
          isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
        } text-white px-4 py-2 rounded-lg text-sm font-medium`}
      >
        {isActive ? "Disable" : "Enable"}
      </button>
    </div>
  );
};

export default InstructorCard;
