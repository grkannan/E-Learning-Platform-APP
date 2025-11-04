import React from 'react';
import VideoLessonManager from './VideoLessonManager';
// import other components when ready

const InstructorManageCoursePage = ({ courseId }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📚 Manage Course ID: {courseId}</h2>

      {/* Tabs or collapsible sections */}
      <div className="space-y-6">
        {/* Section 1: Video Lessons */}
        <VideoLessonManager courseId={courseId} />

        {/* Section 2: Question Documents */}
        {/* <QuestionDocManager courseId={courseId} /> */}

        {/* Section 3: Quiz Manager */}
        {/* <QuizManager courseId={courseId} /> */}
      </div>
    </div>
  );
};

export default InstructorManageCoursePage;
