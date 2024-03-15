import React from 'react';

const SessionMessage = ({ message, color, role }): JSX.Element => {
  if (role === 'assistant')
    return (
      <div style={{ color: color, marginBottom: '20px' }}>
        <strong>Assistant:</strong> {message}
      </div>
    );
  else
    return (
      <div style={{ color: color, marginBottom: '20px' }}>
        <strong>You:</strong> {message}
      </div>
    );
};

export default SessionMessage;
