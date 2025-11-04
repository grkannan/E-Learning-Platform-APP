import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);

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

  const [errors, setErrors] = useState({
    confirmPassword: "",
  });

  const [backendErrors, setBackendErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files[0]) {
      setPreviewImage(URL.createObjectURL(files[0]));
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear errors on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setBackendErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setBackendErrors({});

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "❌ Passwords do not match." });
      return;
    }

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("first_name", formData.firstName);
    data.append("last_name", formData.lastName);
    data.append("dob", formData.dob);
    data.append("details.is_student", true);
    data.append("details.is_instructor", false);
    data.append("details.bio", formData.bio);
    data.append("details.gender", formData.gender);

    if (formData.profilePhoto) {
      data.append("details.profile_picture", formData.profilePhoto);
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/login");
    } catch (error) {
      const errData = error.response?.data || {};
      const fieldErrors = {};

      // Flatten nested `details` errors
      if (errData.details) {
        Object.entries(errData.details).forEach(([key, value]) => {
          fieldErrors[key] = value.join(" ");
        });
      }

      // Handle main User fields
      for (const key in errData) {
        if (key !== "details") {
          fieldErrors[key] = errData[key].join(" ");
        }
      }

      setBackendErrors(fieldErrors);
      console.error("Registration error:", errData);
    }
  };

  const renderError = (field) => {
    return backendErrors[field] ? (
      <p className="text-sm text-red-600 mt-1">{backendErrors[field]}</p>
    ) : null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8 space-y-6"
        encType="multipart/form-data"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Student Registration</h2>
          <p className="text-sm text-gray-600 mt-1">Fill in your details to create an account.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="input"
            />
            {renderError("username")}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input"
            />
            {renderError("email")}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input"
            />
            {renderError("password")}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 rounded-md border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="input"
            />
            {renderError("first_name")}
          </div>

          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="input"
            />
            {renderError("last_name")}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="mt-1 w-full input"
          />
          {renderError("dob")}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="mt-1 w-full input"
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
          {renderError("gender")}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="profilePhoto"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md cursor-pointer"
            >
              Choose File
            </label>
            {formData.profilePhoto && (
              <span className="text-sm text-gray-600 truncate max-w-[200px]">
                {formData.profilePhoto.name}
              </span>
            )}
          </div>
          <input
            id="profilePhoto"
            type="file"
            name="profilePhoto"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          {renderError("profile_picture")}

          {previewImage && (
            <div className="mt-4 text-center">
              <img
                src={previewImage}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-full border shadow"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            rows="3"
            placeholder="Short bio..."
            value={formData.bio}
            onChange={handleChange}
            className="mt-1 w-full input resize-none"
          ></textarea>
          {renderError("bio")}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition"
        >
          Register
        </button>

        <p className="text-sm text-center text-gray-700 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
