import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import InstructorCard from "./InstructorCard";
import LogoutButton from "./LogoutButton";

const AdminDashboard = () => {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");

    axiosInstance.get("/api/instructors/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setInstructors(res.data))
      .catch((err) => console.error("Error loading instructors:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 font-sans">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between bg-purple-200 px-8 py-4 shadow-md">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="h-16 rounded-full" />
          <h1 className="text-2xl font-bold text-purple-800">E-Learning Admin</h1>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
          <Link to="/add-instructor" className="px-4 py-2 rounded-full bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-all">
            Add Instructor
          </Link>
          <Link to="/add-course" className="px-4 py-2 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition-all">
            Assign Course
          </Link>
          <Link to="/admin-course-view" className="px-4 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all">
            All Courses
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* Main */}
      <main className="p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Welcome to Admin Panel</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {instructors.length === 0 ? (
            <p className="text-gray-600">No instructors found.</p>
          ) : (
            instructors.map((inst, index) => (
              <InstructorCard key={index} instructor={inst} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
