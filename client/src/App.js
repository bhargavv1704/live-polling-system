// src/App.js

import React, { useState, useEffect } from 'react';
import RoleSelector from './components/RoleSelector';
import TeacherView from './components/TeacherView';
import StudentView from './components/StudentView';

function App() {
  const [role, setRole] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [tempName, setTempName] = useState('');
  const [joinTimeout, setJoinTimeout] = useState(false);

  // Set timeout for student name input (60 seconds)
  useEffect(() => {
    let timeout;
    if (role === 'student' && !studentName) {
      timeout = setTimeout(() => {
        setJoinTimeout(true);
      }, 60000); // 60 seconds
    }
    return () => clearTimeout(timeout);
  }, [role, studentName]);

  // === Render role selector if no role selected ===
  if (!role) {
    return <RoleSelector setRole={setRole} />;
  }

  // === Render student name entry if student role is selected and name not submitted ===
  if (role === 'student' && !studentName) {
    return (
      <div className="student-container">
        <div className="student-card">
          {!joinTimeout ? (
            <>
              <h2 className="student-title">Enter Your Name</h2>
              <input
                type="text"
                value={tempName}
                placeholder="Your full name"
                onChange={(e) => setTempName(e.target.value)}
                className="student-name-input"
              />
              <button
                className="enter-name-btn"
                onClick={() => {
                  const trimmed = tempName.trim();
                  if (trimmed.length >= 3) {
                    setStudentName(trimmed);
                  } else {
                    alert('Please enter your full name (at least 3 characters).');
                  }
                }}
              >
                Join
              </button>
            </>
          ) : (
            <>
              <h2 className="student-title" style={{ color: '#dc2626' }}>
                Session Timed Out
              </h2>
              <p className="waiting-text">Please refresh the page to try again.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // === Main role views ===
  return (
    <>
      {role === 'teacher' ? (
        <TeacherView />
      ) : (
        <StudentView name={studentName} />
      )}
    </>
  );
}

export default App;
