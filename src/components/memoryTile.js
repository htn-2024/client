import React, { useState } from 'react';

const MemoryTile = ({ title, description, image, onEdit, onDelete }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <div style={styles.tile}>
      <div style={styles.header}>
        <h3>{title}</h3>
        <div style={styles.dropdownContainer}>
          <button onClick={toggleDropdown} style={styles.menuButton}>
            &#8942; {/* Vertical ellipsis for menu button */}
          </button>
          {isDropdownVisible && (
            <div style={styles.dropdown}>
              <button onClick={onEdit} style={styles.dropdownItem}>Edit</button>
              <button onClick={onDelete} style={styles.dropdownItem}>Delete</button>
            </div>
          )}
        </div>
      </div>
      <div style={styles.content}>
        <img src={image} alt={title} style={styles.image} />
        <p>{description}</p>
      </div>
    </div>
  );
};

export default MemoryTile;

const styles = {
  tile: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    position: 'relative',
    width: '200px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownContainer: {
    position: 'relative',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
  },
  dropdown: {
    position: 'absolute',
    right: '0',
    top: '100%',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
  dropdownItem: {
    padding: '8px 12px',
    width: '100%',
    border: 'none',
    backgroundColor: '#fff',
    textAlign: 'left',
    cursor: 'pointer',
  },
  content: {
    marginTop: '12px',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
  },
};
