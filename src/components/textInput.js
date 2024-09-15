import React from 'react';
import './textInput.css';

const TextInput = ({ value, onChange, placeholder, variant, onKeyDown }) => {
  return <input className={`input text ${variant ? variant : ""}`} value={value} onChange={onChange} placeholder={placeholder} onKeyDown={onKeyDown} />
}

export default TextInput;
