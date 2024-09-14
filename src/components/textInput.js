import React from 'react';
import './textInput.css';

const TextInput = ({ value, onChange, placeholder }) => {
  return <input className="input text" value={value} onChange={onChange} placeholder={placeholder} />
}

export default TextInput;
