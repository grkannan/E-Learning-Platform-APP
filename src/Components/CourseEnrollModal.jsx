import React from 'react';

const CourseEnrollModal = ({ course, onClose, onConfirm }) => {
  const instructor_name =
    (course.instructor?.first_name || "") + " " + (course.instructor?.last_name || "");

  const handleEnroll = () => {
    if (onConfirm) {
      onConfirm(course);
    }
    onClose();
  };
console.log('[Modal Course Data]', course);

  return (
    <div style={styles.overlay}>
      <div style={styles.modalContainer}>
        <h2 style={styles.title}>{course.title}</h2>
        <p style={styles.description}>{course.description}</p>
        <div style={styles.buttonGroup}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button onClick={handleEnroll} style={styles.confirmBtn}>Confirm Enroll</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
    width: '90%',
    maxWidth: '500px',
  },
  title: {
    color: 'purple',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  description: {
    color: 'black',
    marginBottom: '16px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  confirmBtn: {
    padding: '10px 20px',
    backgroundColor: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};

export default CourseEnrollModal;
