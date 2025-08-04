// src/components/RoleSelector.js

import React from 'react';
import '../index.css'; // make sure your CSS is loaded

const RoleSelector = ({ setRole }) => {
  return (
    <div className="role-selector-container">
      <div className="role-selector-card">
        <h1 className="role-selector-title">Welcome to the Polling System</h1>
        <p className="role-selector-subtitle">Please choose your role to continue</p>
        <div className="role-selector-buttons">
          <button className="role-button teacher" onClick={() => setRole('teacher')}>
            I'm a Teacher
          </button>
          <button className="role-button student" onClick={() => setRole('student')}>
            I'm a Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;

