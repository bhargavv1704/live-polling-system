import React, { useEffect, useState } from 'react';
import { socket } from '../socket';

function StudentView({ name }) {
    const [poll, setPoll] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);
    const [submittedList, setSubmittedList] = useState([]);

    useEffect(() => {
        socket.emit('student-joined', name);

        socket.on('new-poll', (pollData) => {
            setPoll(pollData);
            setSubmitted(false);
            setResults(null);
            setSubmittedList([]);
        });

        socket.on('poll-update', ({ answers }) => {
            setSubmittedList(Object.keys(answers));
        });

        socket.on('poll-finished', (answers) => {
            setResults(answers);
        });

        return () => {
            socket.off('new-poll');
            socket.off('poll-update');
            socket.off('poll-finished');
        };
    }, [name]);

    const handleSubmit = () => {
        if (!selectedAnswer) return alert('Please select an answer');
        socket.emit('submit-answer', { name, answer: selectedAnswer });
        setSubmitted(true);
    };

    if (!poll) return <h3>Waiting for poll...</h3>;

    return (
        <div style={{ padding: 20 }}>
            <h2>{poll.question}</h2>

            {submitted ? (
                <div>
                    <h3>✅ Answer submitted!</h3>
                    {!results ? (
                        <>
                            <p>Waiting for others to submit...</p>
                            <h4>Who has submitted so far:</h4>
                            <ul>
                                {submittedList.map((n) => (
                                    <li key={n}>{n}</li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <div>
                            <h4>Final Results:</h4>
                            <ul>
                                {Object.entries(results).map(([student, answer]) => (
                                    <li key={student}>
                                        {student}: {answer}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {poll.options.map((opt, i) => (
                        <div key={i}>
                            <input
                                type="radio"
                                name="option"
                                value={opt}
                                onChange={(e) => setSelectedAnswer(e.target.value)}
                            />
                            <label>{opt}</label>
                        </div>
                    ))}
                    <button onClick={handleSubmit} style={{ marginTop: '10px' }}>Submit</button>
                </>
            )}
        </div>
    );
}

export default StudentView;