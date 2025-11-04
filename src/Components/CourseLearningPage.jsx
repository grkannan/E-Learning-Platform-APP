import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link, useParams } from 'react-router-dom';

const CourseLearningPage = () => {
  const { courseId } = useParams();
  const [needToWatch, setNeedToWatch] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [quizUnlocked, setQuizUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);
  const [certificate, setCertificate] = useState(null);
  const [materials, setMaterials] = useState([]); // NEW state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [watchRes, quizRes, progressRes, completedRes, certRes, materialRes] = await Promise.all([
          axiosInstance.get(`/api/course/${courseId}/watch-next/`),
          axiosInstance.get(`/api/course/${courseId}/has-quiz/`),
          axiosInstance.get(`/api/course/${courseId}/progress/`),
          axiosInstance.get(`/api/course/${courseId}/completed/`),
          axiosInstance.get(`/api/certificate/${courseId}/`),
          axiosInstance.get(`/api/course/${courseId}/materials/`) // NEW
        ]);

        const percent = progressRes.data?.progress_percent ?? 0;

        setNeedToWatch(watchRes.data || []);
        setCompletedLessons(completedRes.data || []);
        setProgressPercent(percent);
        setQuizUnlocked(quizRes.data?.has_quiz && percent >= 80);
        console.log(materialRes.data);
        setMaterials(materialRes.data || []);

        if (certRes.data?.is_eligible && certRes.data?.certificate_url) {
          setCertificate(certRes.data);
        }
      } catch (err) {
        console.error('❌ Error loading course data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const renderLessonGrid = (lessons) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {lessons.map(({ id, title, thumbnail }) => (
        <div key={id} className="bg-white rounded-xl shadow hover:shadow-md transition">
          <Link to={`/course/${courseId}/lesson/${id}`}>
            <img
              src={thumbnail.startsWith('http') ? thumbnail : `http://127.0.0.1:8000${thumbnail}`}
              alt={title}
              className="h-40 w-full object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h3 className="text-base font-medium text-gray-700">{title}</h3>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 xl:px-20">
      <div className="mb-6">
        <Link to="/student-dashboard" className="text-sm text-blue-600 hover:underline font-medium">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <p className="text-gray-700 font-medium">📊 Course Progress: {progressPercent}%</p>
        <div className="w-full bg-gray-300 h-3 rounded-full mt-1">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Need to Watch Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎯 Need to Watch</h2>
        {loading ? (
          <p className="text-gray-500">⏳ Loading lessons...</p>
        ) : needToWatch.length === 0 ? (
          <p className="text-red-600 font-medium bg-red-50 px-4 py-3 rounded">
            🚫 No lessons available to watch in this course.
          </p>
        ) : renderLessonGrid(needToWatch)}
      </div>

      {/* Completed Videos Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">✅ Completed Lessons</h2>
        {loading ? (
          <p className="text-gray-500">⏳ Loading...</p>
        ) : completedLessons.length === 0 ? (
          <p className="text-yellow-600">You haven't completed any lessons yet.</p>
        ) : renderLessonGrid(completedLessons)}
      </div>

      {/* Materials Section */}
      {materials.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📚 Course Materials</h2>
          <ul className="space-y-3">
            {materials.map((doc) => (
              <li key={doc.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{doc.title}</p>
                  <p className="text-sm text-gray-500">
                    Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={`${doc.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                  ⬇️ Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quiz Section */}
      <div className="text-center mt-8">
        {quizUnlocked ? (
          <Link
            to={`/course/${courseId}/quiz`}
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            ✅ Take Quiz
          </Link>
        ) : (
          <p className="text-sm text-gray-600">
            🕒 You need to complete at least{' '}
            <span className="font-medium text-gray-800">80%</span> of the course to unlock the quiz.
          </p>
        )}
      </div>

      {/* Certificate Section */}
      {certificate?.is_eligible && (
        <div className="text-center mt-10 bg-green-100 border border-green-400 rounded-xl px-6 py-6 shadow">
          <h3 className="text-xl font-semibold text-green-800 mb-2">🎉 Congratulations!</h3>
          <p className="text-green-700 mb-2">
            You are eligible for the certificate for this course.
          </p>

          {/* Certificate Info */}
          <div className="text-sm text-gray-800 mb-4">
            <p><span className="font-medium">Issued on:</span> {certificate.issued_date}</p>
          </div>

          <a
            href={certificate.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            🎓 View / Download Certificate
          </a>
        </div>
      )}
    </div>
  );
};

export default CourseLearningPage;
