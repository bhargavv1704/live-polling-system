import React, { useState } from 'react';
import RoleSelector from './components/RoleSelector';
import StudentView from './components/StudentView';
import TeacherView from './components/TeacherView';

function App() {
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');

  if (!role) return (
    <div className="container card" style={{ textAlign: 'center' }}>
      <h2>Select Your Role</h2>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setRole('teacher')}>I'm a Teacher</button>
        <button onClick={() => setRole('student')} style={{ marginLeft: '10px' }}>
          I'm a Student
        </button>
      </div>
    </div>
  );

  if (role === 'student' && !name) {
    return (
      <div className="container card" style={{ textAlign: 'center' }}>
        <h3>Enter your name</h3>
        <input
          placeholder="e.g., Ayush Bhargav"
          onChange={(e) => setName(e.target.value)}
        />
        <div>
          <button onClick={() => name && setName(name)}>Join</button>
        </div>
      </div>
    );
  }

  return role === 'teacher'
    ? <TeacherView />
    : <StudentView name={name} />;
}

export default App;