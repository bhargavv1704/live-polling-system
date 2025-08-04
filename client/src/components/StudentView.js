// src/components/StudentView.js

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://live-poll-backend-nd3j.onrender.com');

const StudentView = ({ name }) => {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [timer, setTimer] = useState(60);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    socket.emit('student-joined', name);

    socket.on('new-poll', (poll) => {
      setQuestion(poll);
      setSubmitted(false);
      setSelectedAnswer('');
      setResults(null);
      setTimer(60);
      setShowResults(false);

      // Start countdown
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            if (!submitted) {
              socket.emit('submit-answer', { name, answer: 'No Answer' });
              setSubmitted(true);
              setShowResults(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    });

    socket.on('poll-finished', (answers) => {
      setResults(answers);
      setShowResults(true);
    });

    return () => socket.disconnect();
  }, [name, submitted]);

  const handleSubmit = () => {
    if (selectedAnswer && !submitted) {
      socket.emit('submit-answer', { name, answer: selectedAnswer });
      setSubmitted(true);
      setShowResults(true);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Welcome, {name}</h2>

        {question ? (
          <>
            <p className="question">{question.text}</p>
            <div className="answers">
              {question.options.map((opt, idx) => (
                <label key={idx}>
                  <input
                    type="radio"
                    name="answer"
                    value={opt}
                    disabled={submitted}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                  />{' '}
                  {opt}
                </label>
              ))}
            </div>

            {!submitted && (
              <>
                <button onClick={handleSubmit}>Submit</button>
                <p className="timer">Time left: {timer}s</p>
              </>
            )}

            {submitted && showResults && (
              <div className="card">
                <h3>Your answer has been submitted!</h3>
                {results && (
                  <>
                    <h4>Live Results:</h4>
                    <ul>
                      {Object.entries(results).map(([student, answer]) => (
                        <li key={student}>
                          {student}: <strong>{answer}</strong>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {submitted && !showResults && (
              <p>Waiting for poll to finish...</p>
            )}
          </>
        ) : (
          <h4>Waiting for a poll to start...</h4>
        )}
      </div>
    </div>
  );
};

export default StudentView;
