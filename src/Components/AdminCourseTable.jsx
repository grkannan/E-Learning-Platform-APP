import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AdminCoursesTable = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', price: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('/api/all-courses/');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setFormData({ title: course.title, price: course.price });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (formData.price === '') {
      newErrors.price = 'Price is required.';
    } else if (isNaN(formData.price)) {
      newErrors.price = 'Price must be a number.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setSubmitting(true);
      await axiosInstance.put(`/api/course/${selectedCourse.id}/update/`, formData);
      fetchCourses();
      closeModal();
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-8 bg-white shadow-md font-sans">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">All Courses (Admin View)</h2>

      <div className="flex justify-start space-x-6 bg-yellow-600 text-white font-bold px-6 py-2 mb-4">
        <a href="/admin-panel" className="hover:underline">Dashboard</a>
        <a href="/add-course" className="hover:underline">Add Course</a>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-300">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-4 py-3 border">ID</th>
                <th className="px-4 py-3 border">Title</th>
                <th className="px-4 py-3 border">Instructor</th>
                <th className="px-4 py-3 border">Price</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <tr key={course.id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{course.title || 'Untitled'}</td>
                    <td className="px-4 py-2 border">
                      {course.instructor
                        ? `${course.instructor.first_name} ${course.instructor.last_name}`
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-2 border">
                      {course.price === '0.00' ? 'Free' : `₹${course.price}`}
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        onClick={() => handleEditClick(course)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">No courses available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Course: {selectedCourse.title}</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Price (₹)</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : ''}`}
                />
                {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={submitting}
                className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {submitting ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoursesTable;
