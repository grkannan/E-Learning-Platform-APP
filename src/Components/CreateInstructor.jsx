import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AddInstructorPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    bio: "",
    profilePhoto: null,
  });

  const [previewURL, setPreviewURL] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreviewURL(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      alert("❌ Password and Confirm Password do not match.");
      return;
    }

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("first_name", formData.firstName);
    data.append("last_name", formData.lastName);
    data.append("dob", formData.dob);
    data.append("details.is_student", false);
    data.append("details.is_instructor", true);
    data.append("details.bio", formData.bio);
    data.append("details.gender", formData.gender);
    if (formData.profilePhoto) {
      data.append("details.profile_picture", formData.profilePhoto);
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Instructor Registered Successfully!");
      navigate("/admin-panel");
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      alert("❌ Registration failed. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="w-full max-w-xl bg-white shadow-md rounded-xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Register Instructor</h2>
        <p className="text-sm text-gray-600 text-center mb-4">Add a new instructor below</p>

        <Link
          to="/admin-panel"
          className="block text-center mb-6 text-blue-600 text-sm underline hover:text-blue-800"
        >
          ← Back to Admin Dashboard
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md border border-gray-300 text-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md border border-gray-300 text-sm"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md border border-gray-300 text-sm"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md border border-gray-300 text-sm"
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md border border-gray-300 text-sm"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md border border-gray-300 text-sm"
          />

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-md border border-gray-300 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-md border border-gray-300 text-sm"
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>

          <div className="flex flex-col col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
            <label className="flex items-center gap-2 p-2 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 transition">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v1h2V5h12v1h2V5a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 8H2v7a2 2 0 002 2h12a2 2 0 002-2V8zm-7 2a3 3 0 11-6 0 3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm truncate">
                {formData.profilePhoto ? formData.profilePhoto.name : "Choose a file"}
              </span>
              <input
                type="file"
                name="profilePhoto"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
            {previewURL && (
              <img
                src={previewURL}
                alt="Preview"
                className="mt-3 h-24 w-24 object-cover rounded-full border shadow"
              />
            )}
          </div>
        </div>

        <div className="mt-4">
          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 rounded-md border border-gray-300 text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
        >
          Register Instructor
        </button>
      </form>
    </div>
  );
};

export default AddInstructorPage;
