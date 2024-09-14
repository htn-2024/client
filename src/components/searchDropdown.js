import React from 'react';
import './searchDropdown.css';

const SearchDropdown = ({ options, label, setLabel, placeholder, isDropdownOpen, setIsDropdownOpen, setValue }) => {
  const handleSelect = (option) => {
    console.log(option)
    setLabel(option.label);
    setValue(option.value);
    setIsDropdownOpen(false);
  }

  return (
    <div>
      <input
        className="input text"
        type="text"
        value={label}
        onChange={(e) => {
          setLabel(e.target.value)
          setValue("");
        }}
        placeholder={placeholder}
      />
      {isDropdownOpen && options?.length > 0  && (
        <ul className="options text">
          {options.map((option) => (
            <li
              className="option"
              key={option}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchDropdown;
