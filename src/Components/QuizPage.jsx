import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const QuizPage = () => {
  const { courseId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submittedQuizzes, setSubmittedQuizzes] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    axiosInstance.get(`/api/course/${courseId}/quizzes/`)
      .then(res => {setQuizzes(res.data)})
      .catch(err => console.error("Error fetching quizzes:", err));
  }, [courseId]);

  useEffect(() => {
    if (!selectedQuiz) return;

    axiosInstance.get(`/api/quiz/${selectedQuiz.id}/questions/`)
      .then(res => {
        setQuestions(res.data);
        setAnswers({});
        setCurrentQuestionIndex(0);
      })
      .catch(err => console.error("Error fetching questions:", err));
  }, [selectedQuiz]);

  const handleOptionSelect = (questionId, selectedOptionKey) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedOptionKey }));
    console.log(setAnswers);
  };

  const handleSubmit = async () => {
    try {
      const res = await axiosInstance.post(`/api/quiz/${selectedQuiz.id}/submit/`, { answers });
      setSubmittedQuizzes(prev => ({ ...prev, [selectedQuiz.id]: true }));
      alert(res.data.message || "✅ Quiz submitted!");

      try {
        const certRes = await axiosInstance.post(`/api/certificate/issue/${courseId}/`);
        if (certRes.data?.certificate_url) {
          alert("🎓 Certificate issued! Check your dashboard.");
        }
      } catch (certErr) {
        if (certErr.response?.status === 403) {
          console.warn("⛔ Certificate not issued — score below 75%.");
        } else {
          console.error("❌ Certificate error:", certErr);
        }
      }
    } catch (err) {
      console.error("❌ Submission failed:", err.response?.data || err.message);
      alert("❌ Submission failed.");
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isSubmitted = selectedQuiz && submittedQuizzes[selectedQuiz.id];
  const allAnswered = questions.every(q => q.is_answered);

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">📝 Quizzes</h1>
      <Link to={`/course/${courseId}/lessons`} className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Lessons
      </Link>

      {/* Quiz selector */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">📘 Select Quiz:</h2>
        <div className="flex flex-wrap gap-3">
          {quizzes.map((quiz) => {
            const isQuizSubmitted = submittedQuizzes[quiz.id];
            return (
              <button
                key={quiz.id}
                disabled={isQuizSubmitted}
                onClick={() => setSelectedQuiz(quiz)}
                className={`px-4 py-2 rounded ${
                  selectedQuiz?.id === quiz.id
                    ? 'bg-blue-600 text-white'
                    : isQuizSubmitted
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700'
                }`}
              >
                {quiz.title}
                {isQuizSubmitted && <span className="ml-2 text-xs text-green-700">✅</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions */}
      {selectedQuiz && currentQuestion && (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-medium mb-3 text-gray-700">
            Q{currentQuestionIndex + 1}). {currentQuestion.text}
          </h3>

          <ul className="space-y-3">
            {['option_a', 'option_b', 'option_c', 'option_d'].map((optKey) => {
              const optionValue = currentQuestion[optKey];
              const isCorrect = optKey === currentQuestion.correct_answer;
              const isUserSelected = answers[currentQuestion.id] === optKey;
              const wasUserSelected = currentQuestion.selected_option === optKey;
              const isAnswered = currentQuestion.is_answered;

              let optionStyle = "text-gray-600";
              if (isSubmitted || isAnswered) {
                if (isCorrect) {
                  optionStyle = "bg-green-100 text-green-800 font-semibold px-2 py-1 rounded";
                } else if (wasUserSelected) {
                  optionStyle = "bg-red-100 text-red-800 font-semibold px-2 py-1 rounded";
                }
              }

              return (
                <li key={optKey}>
                  <label className={`flex items-center gap-2 cursor-pointer ${optionStyle}`}>
                    <input
                      type="radio"
                      name={`q${currentQuestion.id}`}
                      value={optKey}
                      checked={
                        isAnswered
                          ? currentQuestion.selected_option === optKey
                          : answers[currentQuestion.id] === optKey
                      }
                      onChange={() => handleOptionSelect(currentQuestion.id, optKey)}
                      disabled={isSubmitted || isAnswered}
                    />
                    {optionValue}
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={currentQuestionIndex === 0}
            >
              ← Previous
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(i => i + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={isSubmitted || allAnswered}
              >
                ✅ Submit Quiz
              </button>
            )}
          </div>

          {(isSubmitted || allAnswered) && (
            <div className="mt-6 text-green-700 font-medium">
              ✅ This quiz has already been submitted or completed.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
