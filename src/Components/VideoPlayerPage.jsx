import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const VideoPlayerPage = () => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [nextLesson, setNextLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [lastReported, setLastReported] = useState(0);

  const videoRef = useRef(null);
  const userSeeked = useRef(false); // flag for manual seeking

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonRes, courseRes, upcomingRes] = await Promise.all([
          axiosInstance.get(`/api/course/${courseId}/lesson/${lessonId}/`),
          axiosInstance.get(`/api/course/${courseId}/`),
          axiosInstance.get(`/api/course/${courseId}/lessons/`)
        ]);

        setLesson(lessonRes.data);
        setWatchedSeconds(lessonRes.data.watched_seconds || 0);
        setCourse(courseRes.data);
        setUpcomingLessons(upcomingRes.data);

        const currentIndex = upcomingRes.data.findIndex(
          (l) => l.id.toString() === lessonId
        );
        setNextLesson(upcomingRes.data[currentIndex + 1] || null);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, lessonId]);

  // Resume video from last watched time
  useEffect(() => {
    const video = videoRef.current;
    if (!video || watchedSeconds <= 0) return;

    const trySeek = () => {
      if (video.readyState >= 1 && watchedSeconds < video.duration) {
        video.currentTime = watchedSeconds;
        console.log(`⏮️ Resumed from ${watchedSeconds}s`);
      } else {
        setTimeout(trySeek, 300);
      }
    };

    trySeek();
  }, [watchedSeconds]);

  const handleTimeUpdate = (e) => {
    const currentTime = Math.floor(e.target.currentTime);

    if (userSeeked.current) {
      userSeeked.current = false; // reset flag
      setLastReported(currentTime); // just sync, don't report
      return;
    }

    if (currentTime - lastReported >= 3 && currentTime > lastReported) {
      axiosInstance
        .post(`/api/lesson-progress/${lessonId}/progress/`, {
          watched_seconds: currentTime
        })
        .then(() => console.log(`[DEBUG] Updated at ${currentTime}s`))
        .catch(err => console.error("Progress update error:", err));

      setLastReported(currentTime);
    }
  };

  const handleSeeking = () => {
    userSeeked.current = true; // flag manual seek
  };

  const handleEnded = () => {
    const finalTime = Math.floor(videoRef.current?.duration || 0);

    axiosInstance.post(`/api/lesson-progress/${lessonId}/progress/`, {
      watched_seconds: finalTime
    })
      .then(() => {
        console.log(`✅ Final watch time ${finalTime}s updated.`);
        return axiosInstance.post(`/api/lesson/${lessonId}/complete/`);
      })
      .then(() => {
        console.log("🎉 Lesson automatically marked as complete!");
      })
      .catch(err => console.error("❌ Error completing lesson:", err));
  };

  const handleComplete = () => {
    axiosInstance.post(`/api/lesson/${lessonId}/complete/`)
      .then(() => alert('✅ Lesson manually marked as complete!'))
      .catch(err => console.error("Manual complete error:", err));
  };

  if (loading) return <p className="text-center py-8 text-gray-500">⏳ Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 lg:px-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Video Player Section */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{lesson.title}</h2>

        <video
          ref={videoRef}
          src={lesson.videofile}
          className="w-full rounded-lg mb-6"
          controls
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onSeeking={handleSeeking}
          onEnded={handleEnded}
        />

        <p className="text-gray-700 mb-6">{lesson.description}</p>

        <div className="flex flex-wrap gap-4">
          {nextLesson && (
            <Link
              to={`/course/${courseId}/lesson/${nextLesson.id}`}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
            >
              ⏭️ Next: {nextLesson.title}
            </Link>
          )}
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">📺 Upcoming Lessons</h3>
          <button
            onClick={() => navigate(`/course/${courseId}/lessons`)}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back
          </button>
        </div>

        <ul className="space-y-3">
          {upcomingLessons.map((item, idx) => (
            <li key={item.id}>
              <Link
                to={`/course/${courseId}/lesson/${item.id}`}
                className={`block px-4 py-2 rounded-md border text-sm font-medium transition flex justify-between items-center 
                  ${item.id.toString() === lessonId
                    ? 'bg-blue-50 border-blue-500 text-blue-800 font-semibold'
                    : item.is_completed
                      ? 'bg-green-50 border-green-500 text-green-700 font-medium'
                      : 'border-gray-200 hover:bg-gray-100 text-gray-700'}`}
              >
                <span>{idx + 1}. {item.title}</span>
                {item.is_completed && (
                  <span className="text-green-600 ml-2 text-lg">✅</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
