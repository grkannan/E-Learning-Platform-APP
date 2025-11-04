import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => (
  <div className="border rounded-xl shadow p-4">
    <img src={course.thumbnail} alt={course.title} className="h-40 w-full object-cover mb-2 rounded" />
    <h3 className="font-semibold text-lg">{course.title}</h3>
    <p className="text-sm text-gray-600">{course.description.substring(0, 100)}...</p>
    <Link to={`/student/course/${course.id}`} className="text-blue-600 mt-2 block">View Course</Link>
  </div>
);

export default CourseCard;
