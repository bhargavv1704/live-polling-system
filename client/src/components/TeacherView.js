import React, { useState } from 'react';
import { socket } from '../socket';

export default function TeacherView() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);

  const handleCreate = () => {
    socket.emit('create-poll', { question, options });
    setQuestion('');
    setOptions(['', '', '', '']);
  };

  return (
    <div>
      <h2>Create Poll</h2>
      <input
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) => {
            const newOpts = [...options];
            newOpts[i] = e.target.value;
            setOptions(newOpts);
          }}
        />
      ))}
      <button onClick={handleCreate}>Start Poll</button>
    </div>
  );
}