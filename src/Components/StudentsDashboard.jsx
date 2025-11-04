import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import LogoutButton from './LogoutButton';
import SearchResult from './SearchResult';
import CourseEnrollModal from './CourseEnrollModal';

const StudentDashboard = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [profile, setProfile] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');

    axiosInstance.get('/api/student/profile/', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setProfile(res.data));

    axiosInstance.get('/api/student/my-courses/', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setMyCourses(res.data));

    axiosInstance.get('/api/student/recommended-courses/', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setRecommendedCourses(res.data));
  }, []);

  const handleEnroll = async (course) => {
    try {
      await axiosInstance.post('/api/student/enroll/', {
        course_id: course.id,
      });
      alert(`✅ Successfully enrolled in: ${course.title}`);
      const enrolled = await axiosInstance.get('/api/student/my-courses/');
      setMyCourses(enrolled.data);
    } catch (error) {
      console.error("❌ Enrollment error:", error);
      alert(`❌ Enrollment failed for "${course.title}".`);
    }
  };

  const renderCourseCard = (course, index, isRecommended = false) => (
    <div
      key={course.id || index}
      className={`bg-white text-black rounded-lg w-52 p-4 shadow-md hover:shadow-lg transition cursor-pointer ${isRecommended ? 'hover:scale-105' : ''}`}
      onClick={isRecommended ? () => setSelectedCourse(course) : undefined}
      role={isRecommended ? 'button' : undefined}
      tabIndex={isRecommended ? 0 : undefined}
      onKeyDown={isRecommended ? (e) => e.key === 'Enter' && setSelectedCourse(course) : undefined}
    >
      <img
        src={`http://127.0.0.1:8000${course.thumbnail}`}
        alt="course"
        className="w-full rounded-md"
      />
      <div className="mt-3">
        <h3 className="font-semibold text-lg">{course.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
        <span className={`inline-block mt-2 px-2 py-1 text-xs font-bold rounded border ${course.is_paid ? 'text-red-600 border-red-600' : 'text-green-600 border-green-600'}`}>
          {course.is_paid ? 'PAID' : 'FREE'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex w-full max-w-screen-xl mx-auto font-sans">
      <aside className="w-64 bg-slate-800 text-white min-h-screen p-6">
        <h2 className="text-xl font-bold mb-6">STUDENT - DASHBOARD</h2>

        <div className="bg-yellow-100 text-black rounded-lg shadow-inner">
          <div className="bg-gray-700 text-white text-center py-3 font-semibold rounded-t-lg">PROFILE</div>
          <div className="px-4 py-6">
            {profile.profile_picture && (
              <div className="flex justify-center mb-4">
                <img
                  src={`http://127.0.0.1:8000/${profile.profile_picture}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border"
                />
              </div>
            )}
            <div className="space-y-1 text-sm">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Certified:</strong> {profile.certified}</p>
              <p><strong>Learning:</strong> {profile.learning}</p>
              <div className="text-center mt-4">
                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition">EDIT PROFILE</button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">
        <header className="flex items-center justify-between mb-8">
          <img src="/logo.png" alt="Logo" className="h-24" />
          <SearchResult />
          <LogoutButton />
        </header>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">My Courses</h2>
          <div className="flex gap-4 flex-wrap">
            {myCourses.map((course, idx) => (
              <Link to={`/course/${course.id}/lessons`} key={course.id} className="no-underline">
                {renderCourseCard(course, idx)}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Recommended Courses</h2>
          <div className="flex gap-4 flex-wrap">
            {recommendedCourses
              .filter(rc => !myCourses.some(mc => mc.id === rc.id))
              .map((course, idx) => renderCourseCard(course, idx, true))}
          </div>
        </section>
      </main>

      {selectedCourse && (
        <CourseEnrollModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onConfirm={handleEnroll}
        />
      )}
    </div>
  );
};

export default StudentDashboard;