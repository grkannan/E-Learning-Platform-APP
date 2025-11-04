import { useParams } from 'react-router-dom';
import InstructorManageCoursePage from './InstructorManageCourse';

const InstructorCourseWrapper = () => {
  const { courseId } = useParams();
  return <InstructorManageCoursePage courseId={courseId} />;
};

export default InstructorCourseWrapper;
