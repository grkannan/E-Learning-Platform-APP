import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user_type", res.data.user_type);

      if (res.data.user_type === "admin") navigate("/admin-panel");
      else if (res.data.user_type === "instructor") navigate("/instructor-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md shadow-xl rounded-xl p-10 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Welcome Back!</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Login to continue your learning journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={form.username}
            placeholder="Username"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full py-2 bg-gray-900 text-white rounded-md font-semibold hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>

        {error && (
          <div className="mt-4 text-red-700 text-sm flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        <p className="mt-6 text-sm text-center text-gray-700">
          New here?{" "}
          <a href="/register" className="text-blue-600 font-medium hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
