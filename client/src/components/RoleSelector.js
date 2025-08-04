// src/components/RoleSelector.js

import React from 'react';
import '../index.css';

const RoleSelector = ({ setRole }) => {
  return (
    <div className="role-container">
      <div className="role-card">
        <h1 className="role-title">Select Your Role</h1>
        <div className="role-buttons">
          <button className="role-btn" onClick={() => setRole('teacher')}>
            I'm a Teacher
          </button>
          <button className="role-btn" onClick={() => setRole('student')}>
            I'm a Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
