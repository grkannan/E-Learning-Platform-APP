import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AssignCourse = () => {
  const [instructors, setInstructors] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    thumbnail: null,
    instructor_id: '',
  });

  const [previewURL, setPreviewURL] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/api/instructors/')
      .then(res => setInstructors(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const updatedValue = files ? files[0] : value;
    setForm(prev => ({ ...prev, [name]: updatedValue }));

    if (name === 'thumbnail' && files && files[0]) {
      setPreviewURL(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }

    try {
      await axiosInstance.post('/api/assign-course/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('✅ Course assigned successfully!');
      navigate("/admin-panel");
    } catch (err) {
      console.error(err);
      alert('❌ Failed to assign course.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-blue-100 px-4">
      <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Assign New Course</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-blue-500 text-sm"
          />

          <textarea
            name="description"
            placeholder="Course Description"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md border border-gray-300 resize-none focus:outline-blue-500 text-sm"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-blue-500 text-sm"
          />

          <select
            name="instructor_id"
            onChange={handleChange}
            value={form.instructor_id}
            required
            className="w-full p-3 rounded-md border border-gray-300 bg-white focus:outline-blue-500 text-sm"
          >
            <option value="">Select Instructor</option>
            {instructors.map(ins => (
              <option key={ins.id} value={ins.id}>
                {ins.first_name} {ins.last_name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price (in ₹)"
            step="0.01"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-blue-500 text-sm"
          />

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Course Thumbnail</label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm"
            />
            {previewURL && (
              <img
                src={previewURL}
                alt="Preview"
                className="mt-3 h-36 w-contain object-contain rounded-md border border-gray-200 shadow"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Assign Course
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Want to go back?{' '}
          <a href="/admin-panel" className="text-blue-600 underline hover:text-blue-800 font-medium">
            Click here
          </a>
        </p>
      </div>
    </div>
  );
};

export default AssignCourse;
