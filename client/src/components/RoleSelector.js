import React from 'react';

export default function RoleSelector({ setRole }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '20%' }}>
      <h2>Are you a student or teacher?</h2>
      <button onClick={() => setRole('student')}>I am Student</button>
      <button onClick={() => setRole('teacher')}>I am Teacher</button>
    </div>
  );
}
