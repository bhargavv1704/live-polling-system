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
                <h2 className="student-title">Hi, {name} 👋</h2>

                {question ? (
                    <>
                        <p className="student-question">{question.text}</p>

                        <div className="student-options">
                            {question.options.map((opt, idx) => (
                                <label key={idx} className="student-option">
                                    <input
                                        type="radio"
                                        name="answer"
                                        value={opt}
                                        disabled={submitted}
                                        onChange={(e) => setSelectedAnswer(e.target.value)}
                                    />
                                    <span>{opt}</span>
                                </label>
                            ))}
                        </div>

                        {!submitted && (
                            <>
                                <button className="student-submit-btn" onClick={handleSubmit}>
                                    Submit Answer
                                </button>
                                <p className="student-timer">⏳ {timer}s left</p>
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
                                                    <strong>{student}</strong>: {answer}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <p className="student-waiting">Waiting for a poll to start...</p>
                )}
            </div>
        </div>
    );
};

export default StudentView;
