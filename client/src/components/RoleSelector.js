// src/components/RoleSelector.js

import React from 'react';
import '../index.css'; // Ensure styling is linked

const RoleSelector = ({ setRole }) => {
  return (
    <div className="role-selector-container">
      <div className="role-selector-card">
        <h1 className="role-selector-title">Select Your Role</h1>
        <p className="role-selector-subtitle">You must select a role to proceed.</p>
        <div className="role-selector-buttons">
          <button className="role-button teacher" onClick={() => setRole('teacher')}>
            I’m a Teacher
          </button>
          <button className="role-button student" onClick={() => setRole('student')}>
            I’m a Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
