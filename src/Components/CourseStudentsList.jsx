import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useParams, Link } from 'react-router-dom';

const CourseStudentsList = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!courseId) return;
    axiosInstance
      .get(`/api/instructor/course/${courseId}/students/`)
      .then((res) => setStudents(res.data))
      .catch((err) => console.error('Failed to fetch students:', err));
  }, [courseId]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* 🔙 Dashboard Link */}
      <div className="mb-4">
        <Link
          to="/instructor-dashboard"
          className="text-blue-600 hover:underline font-medium text-sm"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">📚 Enrolled Students</h2>

      {students.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No students enrolled in this course yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-full bg-white text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Quiz Score</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={student.id} className="hover:bg-gray-50 transition border-b">
                  <td className="px-4 py-3 font-medium text-gray-800">{idx + 1}</td>
                  <td className="px-4 py-3">
                    {student.full_name ||
                      `${student.first_name} ${student.last_name}`}
                  </td>
                  <td className="px-4 py-3">{student.email}</td>
                  <td className="px-4 py-3">{student.progress || '0'}%</td>

                  {/* ✅ Quiz Score cell */}
                  <td className="px-4 py-3">
                    {student.quiz_score
                      ? `${student.quiz_score.correct}/${student.quiz_score.total}`
                      : 'Not Attempted'}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        student.progress === 100
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {student.progress === 100 ? 'Completed' : 'In Progress'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseStudentsList;
