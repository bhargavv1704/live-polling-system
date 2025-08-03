import React, { useEffect, useState } from 'react';
import { socket } from '../socket';

export default function StudentView({ name }) {
    const [poll, setPoll] = useState(null);
    const [selected, setSelected] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);

    useEffect(() => {
        socket.emit('student-joined', name);

        socket.on('new-poll', (pollData) => {
            setPoll(pollData);
            setSubmitted(false);
            setResults(null);
        });

        socket.on('poll-update', () => {
            // ignore partial updates for now
        });

        socket.on('poll-finished', (answers) => {
            setResults(answers);
        });
    }, [name]);

    const handleSubmit = () => {
        socket.emit('submit-answer', { name, answer: selected });
        setSubmitted(true);
    };

    if (!poll) return <h3>Waiting for teacher to post a question...</h3>;

    return (
        <div>
            <h2>{poll.question}</h2>
            {poll.options.map((opt, i) => (
                <div key={i}>
                    <input
                        type="radio"
                        name="option"
                        value={opt}
                        onChange={() => setSelected(opt)}
                        disabled={submitted}
                    />
                    {opt}
                </div>
            ))}
            {!submitted && <button onClick={handleSubmit}>Submit</button>}

            {results && (
                <div>
                    <h3>Results:</h3>
                    {Object.entries(results).map(([student, ans]) => (
                        <p key={student}>{student}: {ans}</p>
                    ))}
                </div>
            )}
        </div>
    );
}
