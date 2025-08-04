// src/components/RoleSelector.js

import React from 'react';

const RoleSelector = ({ setRole }) => {
  return (
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
};

export default RoleSelector;
