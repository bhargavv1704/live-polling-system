import React, { useState } from 'react';
import RoleSelector from './components/RoleSelector';
import StudentView from './components/StudentView';
import TeacherView from './components/TeacherView';

function App() {
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');

  if (!role) return <RoleSelector setRole={setRole} />;

  if (role === 'student' && !name) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20%' }}>
        <h3>Enter your name:</h3>
        <input onChange={(e) => setName(e.target.value)} />
        <button onClick={() => name && setName(name)}>Join</button>
      </div>
    );
  }

  return role === 'teacher' ? <TeacherView /> : <StudentView name={name} />;
}

export default App;