import React from 'react';

const LessonSidebar = ({ lessons, selectedLesson, onSelect, completedLessons }) => {
  const sidebarStyle = {
    width: '250px',
    backgroundColor: '#f7fafc',
    padding: '16px',
    borderRight: '1px solid #e2e8f0',
    height: '100%',
    overflowY: 'auto',
  };

  const headingStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
  };

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  };

  const itemBaseStyle = {
    padding: '8px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    outline: 'none',
  };

  const selectedStyle = {
    backgroundColor: '#bee3f8',
    fontWeight: '600',
  };

  const completedMarkStyle = {
    color: 'green',
    fontSize: '14px',
    marginLeft: '8px',
  };

  return (
    <div style={sidebarStyle}>
      <h2 style={headingStyle}>Lessons</h2>
      {lessons.length === 0 ? (
        <p style={{ color: '#718096' }}>No lessons available</p>
      ) : (
        <ul style={listStyle}>
          {lessons.map((lesson) => {
            const isSelected = selectedLesson?.id === lesson.id;
            const isCompleted = completedLessons.includes(lesson.id);
            return (
              <li
                key={lesson.id}
                onClick={() => onSelect(lesson)}
                onKeyDown={(e) => e.key === 'Enter' && onSelect(lesson)}
                tabIndex={0}
                role="button"
                style={{
                  ...itemBaseStyle,
                  ...(isSelected ? selectedStyle : { backgroundColor: '#edf2f7' }),
                }}
              >
                {lesson.title}
                {isCompleted && <span style={completedMarkStyle}>✓</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LessonSidebar;
