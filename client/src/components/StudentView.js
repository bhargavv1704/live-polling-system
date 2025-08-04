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

    useEffect(() => {
        socket.emit('student-joined', name);

        socket.on('new-poll', (poll) => {
            setQuestion(poll);
            setSubmitted(false);
            setSelectedAnswer('');
            setResults(null);
            setTimer(60);
        });

        socket.on('poll-finished', (answers) => {
            setResults(answers);
        });

        return () => socket.disconnect();
    }, [name]);

    useEffect(() => {
        if (!submitted && question) {
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        socket.emit('submit-answer', { name, answer: 'No Answer' });
                        setSubmitted(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [submitted, question, name]);

    const handleSubmit = () => {
        if (selectedAnswer) {
            socket.emit('submit-answer', { name, answer: selectedAnswer });
            setSubmitted(true);
        }
    };

    return (
        <div className="student-container">
            <div className="student-card">
                <h1 className="student-title">Hi, {name}</h1>

                {question ? (
                    <>
                        <p className="question-text">{question.text}</p>

                        <div className="option-list">
                            {question.options.map((opt, idx) => (
                                <label key={idx} className="option-item">
                                    <input
                                        type="radio"
                                        name="answer"
                                        value={opt}
                                        disabled={submitted}
                                        onChange={(e) => setSelectedAnswer(e.target.value)}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>

                        {!submitted && (
                            <>
                                <button className="submit-btn" onClick={handleSubmit}>
                                    Submit Answer
                                </button>
                                <p className="timer-label">Time left: {timer}s</p>
                            </>
                        )}

                        {submitted && (
                            <div className="student-results">
                                <h3>Your answer has been submitted!</h3>
                                {results && (
                                    <>
                                        <h4>Live Results</h4>
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
                    </>
                ) : (
                    <h4 className="waiting-text">Waiting for a poll to start...</h4>
                )}
            </div>
        </div>
    );
};

export default StudentView;
