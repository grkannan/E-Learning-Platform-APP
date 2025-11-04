import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import booksImage from '../assets/books.png';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    const role = localStorage.getItem('user_type');

    if (token && role) {
      switch (role) {
        case 'admin':
          navigate('/admin-panel');
          break;
        case 'instructor':
          navigate('/instructor-dashboard');
          break;
        case 'student':
          navigate('/student-dashboard');
          break;
        default:
          break;
      }
    }
  }, []);

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between min-h-screen px-6 md:px-20 py-16 bg-gray-50 text-gray-900 overflow-hidden">

      {/* Background Blurs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-100 rounded-full blur-2xl opacity-10 -z-10"></div>

      {/* Left Section */}
      <div className="z-10 flex flex-col justify-center space-y-6 max-w-xl">
        <img src="/logo.png" alt="TWSCC Logo" className="w-24 shadow-md rounded-full" />

        <h1 className="text-5xl font-serif font-bold tracking-tight text-gray-800">
          E-Learning
        </h1>

        <p className="text-lg text-gray-700 italic leading-relaxed border-l-4 border-blue-600 pl-4">
          “Learning never stops, and neither should you. Unlock knowledge, anytime, anywhere.”
        </p>

        <div className="flex gap-4 pt-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-gray-900 text-white rounded-full shadow font-medium text-sm hover:bg-gray-800 transition"
          >
            LOGIN
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-full shadow font-medium text-sm hover:bg-gray-100 transition"
          >
            REGISTER
          </Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex justify-center items-center flex-1">
        <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-md">
          <img
            src={booksImage}
            alt="Books"
            className="max-w-[300px] md:max-w-[400px] drop-shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
