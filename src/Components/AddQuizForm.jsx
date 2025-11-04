import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; // your configured Axios with JWT token

const AddQuizForm = () => {
  const { courseId } = useParams(); // course ID from URL
  const navigate = useNavigate();
  var success = "";
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    {
      text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: '',
    },
  ]);
  const [error, setError] = useState('');

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: '',
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    for (const q of questions) {
      if (
        !q.text ||
        !q.option_a ||
        !q.option_b ||
        !q.option_c ||
        !q.option_d ||
        !q.correct_answer
      ) {
        setError('Please fill all fields for each question.');
        return;
      }
    }

    try {
      await axiosInstance.post('/api/quiz/create/', {
        title,
        is_active: true,
        course: courseId,
        questions,
      });

      success = 'Quiz created successfully!';
      navigate(`/instructor-dashboard`);
    } catch (err) {
      setError('Failed to create quiz. Check the console.');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Create Quiz</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      <p color="Green">{success}</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block font-medium mb-1">Quiz Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {questions.map((q, index) => (
          <div key={index} className="border p-4 rounded mb-4">
            <h2 className="font-semibold mb-2">Question {/*index + 1*/}</h2>

            <input
              type="text"
              placeholder="Question Text"
              className="w-full border p-2 mb-2"
              value={q.text}
              onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Option A"
              className="w-full border p-2 mb-2"
              value={q.option_a}
              onChange={(e) => handleQuestionChange(index, 'option_a', e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Option B"
              className="w-full border p-2 mb-2"
              value={q.option_b}
              onChange={(e) => handleQuestionChange(index, 'option_b', e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Option C"
              className="w-full border p-2 mb-2"
              value={q.option_c}
              onChange={(e) => handleQuestionChange(index, 'option_c', e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Option D"
              className="w-full border p-2 mb-2"
              value={q.option_d}
              onChange={(e) => handleQuestionChange(index, 'option_d', e.target.value)}
              required
            />

            <select
              className="w-full border p-2 mb-2"
              value={q.correct_answer}
              onChange={(e) => handleQuestionChange(index, 'correct_answer', e.target.value)}
              required
            >
              <option value="">Select Correct Answer</option>
              <option value="option_a">Option A</option>
              <option value="option_b">Option B</option>
              <option value="option_c">Option C</option>
              <option value="option_d">Option D</option>
            </select>

            <button
              type="button"
              onClick={() => removeQuestion(index)}
              className="text-red-500 mt-1"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Submit Quiz
        </button>
      </form>
    </div>
  );
};

export default AddQuizForm;
