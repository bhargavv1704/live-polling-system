import React, { useState } from 'react';
import RoleSelector from './components/RoleSelector';
import StudentView from './components/StudentView';
import TeacherView from './components/TeacherView';
import { socket } from './socket'; // ✅ make sure this import exists

function App() {
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false); // ✅ track if student has joined

  if (!role) return <RoleSelector setRole={setRole} />;

  if (role === 'student' && !joined) {
    const handleJoin = () => {
      const trimmedName = name.trim();
      if (trimmedName) {
        socket.emit('student-joined', trimmedName); // ✅ emit join event only once
        setJoined(true);
      }
    };

    return (
      <div style={{ textAlign: 'center', marginTop: '20%' }}>
        <h3>Enter your name:</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <br /><br />
        <button onClick={handleJoin}>Join</button>
      </div>
    );
  }

  return role === 'teacher' ? <TeacherView /> : <StudentView name={name} />;
}

export default App;
