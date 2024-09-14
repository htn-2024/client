import React from 'react';
import './textArea.css';

const TextArea = ({ value, onChange, placeholder }) => {
  return <textarea className="textarea text" value={value} onChange={onChange} placeholder={placeholder} />
}

export default TextArea;
