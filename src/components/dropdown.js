import React, { useState } from 'react';
import { Close } from '@mui/icons-material';
import './dropdown.css';

const Dropdown = ({ options, selected, setSelected, placeholder, variant }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelect = (option) => {
    setSelected(option);
    setIsDropdownOpen(false);
  }

  return (
    <div>
      <button 
        className={`dropdown-toggle ${variant ? variant : ""} text`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        type="button"
      >
        {selected?.label || placeholder}
        {selected?.label && (
          <div onClick={() => setSelected(null)} className="close-icon">
            <Close />
          </div>
        )}
      </button>
      {isDropdownOpen && (
        <ul className="options text">
          {options.length > 0 ? 
            <>
              {options.map((option) => (
                <li
                  className="option"
                  key={option}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </li>
              ))}
            </>
            :
            <>
              <li className="option"> 
                No options
              </li>
            </>
          }
        </ul>
      )}
    </div>
  )
}

export default Dropdown;
