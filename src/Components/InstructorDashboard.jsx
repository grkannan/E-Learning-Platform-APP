import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { FaEdit, FaTrash, FaBookOpen, FaChalkboardTeacher, FaUser, FaHome, FaFileUpload } from 'react-icons/fa';
import MaterialUploadModal from './MaterialUploadModal';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    axiosInstance.get('/api/instructor/courses/')
      .then(res => setCourses(res.data))
      .catch(err => console.error('Error fetching courses:', err));

    axiosInstance.get('/api/instructor/me/')
      .then(res => setInstructor(res.data))
      .catch(err => console.error('Error fetching instructor:', err));
  }, []);

  const openModal = (courseId) => {
    setSelectedCourseId(courseId);
    setShowModal(true);
  };

  const fullName = instructor?.first_name || instructor?.last_name
    ? `${instructor?.first_name || ''} ${instructor?.last_name || ''}`.trim()
    : instructor?.username;

  const profilePicURL = instructor?.profile_pic?.startsWith('http')
    ? instructor.profile_pic
    : instructor?.profile_pic
      ? `${import.meta.env.VITE_API_BASE_URL || ''}${instructor.profile_pic}`
      : '/default-avatar.png';

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-72 bg-white fixed top-0 left-0 bottom-0 shadow-lg p-6 flex flex-col justify-between z-10">
        <div>
          <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">Instructor Panel</h2>

          {instructor && (
            <div className="flex flex-col items-center text-center mb-6">
              <img
                src={profilePicURL}
                alt="Instructor"
                className="w-20 h-20 rounded-full object-cover shadow mb-3"
              />
              <h3 className="text-lg font-medium">{fullName}</h3>
              <p className="text-sm text-gray-600">{instructor.email}</p>
              <p className="text-xs text-gray-500">@{instructor.username}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex flex-col gap-2 mt-4">
            <SidebarLink to="#" icon={<FaHome />} label="Dashboard" />
            <SidebarLink to="#" icon={<FaChalkboardTeacher />} label="My Courses" />
            <SidebarLink to="#" icon={<FaUser />} label="Edit Profile" />
          </nav>
        </div>

        {/* Logout Button */}
        <div className="pt-4 border-t">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8">Your Courses</h1>

        {courses.length === 0 ? (
          <p className="text-gray-500 text-lg">You haven't created any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 p-5 flex flex-col justify-between">
                <img
                  src={course.thumbnail?.startsWith('http') ? course.thumbnail : `${import.meta.env.VITE_API_BASE_URL || ''}${course.thumbnail}`}
                  alt={course.title}


                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                  <p className="text-sm text-gray-600 mb-1">Category: {course.category}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {course.description?.slice(0, 100) || 'No description provided'}...
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <ActionButton to={`/instructor/video-upload/${course.id}`} color="blue" icon={<FaEdit />} label="Upload Video Lessons" />
                  <ActionButton to={`/instructor/add-quiz/${course.id}`} color="blue" icon={<FaEdit />} label="Add Quiz" />
                  <ActionButton to={`/instructor/course/${course.id}/students`} color="indigo" icon={<FaBookOpen />} label="Students List" />
                  <ActionButton to="#" color="green" icon={<FaFileUpload />} label="Add Materials" onClick={() => openModal(course.id)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <MaterialUploadModal
          courseId={selectedCourseId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

const ActionButton = ({ to, color, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-white bg-${color}-600 hover:bg-${color}-700 transition`}
  >
    {icon}
    {label}
  </Link>
);

const SidebarLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default InstructorDashboard;
