// src/App.js

import React, { useState } from 'react';
import RoleSelector from './components/RoleSelector';
import TeacherView from './components/TeacherView';
import StudentView from './components/StudentView';

function App() {
  const [role, setRole] = useState(null);
  const [studentName, setStudentName] = useState('');

  if (!role) {
    return <RoleSelector setRole={setRole} />;
  }

  if (role === 'student' && !studentName) {
    return (
      <div className="container card" style={{ textAlign: 'center' }}>
        <h2>Enter Your Name</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <button onClick={() => studentName.trim() && setStudentName(studentName.trim())}>
          Join
        </button>
      </div>
    );
  }

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