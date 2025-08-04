// src/components/TeacherView.js

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://live-poll-backend-nd3j.onrender.com');

const TeacherView = () => {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [answers, setAnswers] = useState({});
  const [students, setStudents] = useState([]);

  const allAnswered = Object.keys(answers).length === students.length;

  useEffect(() => {
    socket.on('new-poll', (poll) => {
      setCurrentPoll(poll);
      setAnswers({});
    });

    socket.on('poll-update', ({ answers }) => {
      setAnswers(answers);
    });

    socket.on('poll-finished', (finalAnswers) => {
      setAnswers(finalAnswers);
    });

    socket.on('student-list-updated', (updatedStudents) => {
      setStudents(updatedStudents);
    });

    return () => socket.disconnect();
  }, []);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleCreatePoll = () => {
    if (questionText && options.every((opt) => opt.trim())) {
      const poll = {
        text: questionText,
        options: options,
      };
      socket.emit('create-poll', poll);
      setCurrentPoll(poll);
      setQuestionText('');
      setOptions(['', '', '', '']);
    } else {
      alert('Please fill all question and options.');
    }
  };

  const handleResetPoll = () => {
    setCurrentPoll(null);
    setAnswers({});
  };

  return (
    <div className="teacher-container">
      <div className="teacher-card">
        <h1 className="teacher-title">Teacher Dashboard</h1>
        {!currentPoll || allAnswered ? (
          <>
            <input
              type="text"
              className="question-input"
              placeholder="Enter your question..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
            {options.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                className="option-input"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
              />
            ))}
            <button className="create-btn" onClick={handleCreatePoll}>
              Create Poll
            </button>
          </>
        ) : (
          <div className="poll-card">
            <p className="question">{currentPoll.text}</p>
            <h4>Waiting for students to answer...</h4>
            <p>
              {Object.keys(answers).length}/{students.length} students answered
            </p>
          </div>
        )}

        {Object.keys(answers).length > 0 && (
          <div className="results-card">
            <h3>Live Poll Results:</h3>
            <ul>
              {Object.entries(answers).map(([student, answer]) => (
                <li key={student}>
                  {student}: <strong>{answer}</strong>
                </li>
              ))}
            </ul>
            {allAnswered && (
              <button className="create-btn" onClick={handleResetPoll}>
                Ask New Question
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherView;
