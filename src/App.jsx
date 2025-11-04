import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import LoginPage from "./Components/LoginForm";
import RegisterPage from "./Components/RegisterForm";

// Admin
import AdminPage from "./Components/AdminDashboard";
import CreateInstructor from "./Components/CreateInstructor";
import AddCourse from "./Components/AddCourse";
import AdminCoursesTable from "./Components/AdminCourseTable";

// Instructor
import InstructorDashboard from "./Components/InstructorDashboard";
import InstructorCourseWrapper from "./Components/InstructorCourseWrapper";
import CourseStudentsList from "./Components/CourseStudentsList";
import AddQuizForm from "./Components/AddQuizForm";

// Student
import StudentDashboard from "./Components/StudentsDashboard";
import VideoPlayerPage from "./Components/VideoPlayerPage";
import CourseLearningPage from "./Components/CourseLearningPage";
import QuizPage from "./Components/QuizPage";
import CertificatePage from "./Components/CertificatePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login/" element={<LoginPage />} />
        <Route path="/register/" element={<RegisterPage />} />

        {/* Admin Routes */}
        <Route path="/admin-panel/" element={<AdminPage />} />
        <Route path="/add-instructor/" element={<CreateInstructor />} />
        <Route path="/add-course/" element={<AddCourse />} />
        <Route path="/admin-course-view/" element={<AdminCoursesTable />} />

        {/* Instructor Routes */}
        <Route path="/instructor-dashboard/" element={<InstructorDashboard />} />
        <Route path="/instructor/video-upload/:courseId/" element={<InstructorCourseWrapper />} />
        <Route path="/instructor/course/:courseId/students/" element={<CourseStudentsList />} />
        <Route path="/instructor/add-quiz/:courseId" element={<AddQuizForm />} />

        {/* Student Routes */}
        <Route path="/student-dashboard/" element={<StudentDashboard />} />
        {/* <Route path="/student-explore/course/:courseId/" element={<CourseLearningPage />} /> */}

        <Route path="/course/:courseId/lessons" element={<CourseLearningPage />} />
        <Route path="/course/:courseId/quiz" element={<QuizPage />} />
        <Route path="/course/:courseId/lesson/:lessonId" element={<VideoPlayerPage />} />

        <Route path="/course/:courseId/certificate" element={<CertificatePage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
