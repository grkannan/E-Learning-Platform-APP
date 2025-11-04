import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import './css/LessonCards.css';

const AllLessonsPage = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/api/course/${courseId}/lessons/`)
      .then(res => setLessons(res.data));
  }, [courseId]);

  return (
    <div className="lesson-page-container">
      <h1 className="page-title">🎓 All Lessons</h1>
      <div className="lesson-card-grid">
        {lessons.map(lesson => (
          <div
            key={lesson.id}
            className="lesson-card"
            onClick={() => navigate(`/course/${courseId}/lesson/${lesson.id}`)}
          >
            <video className="lesson-thumbnail" src={`http://127.0.0.1:8000${lesson.videofile}`} />
            <h3 className="lesson-title">{lesson.title}</h3>
            <p className="lesson-desc">{lesson.description?.substring(0, 80)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllLessonsPage;
