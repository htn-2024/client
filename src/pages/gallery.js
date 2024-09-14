import React from 'react';
import MemoryTile from '../components/memoryTile';

const Gallery = () => {
  // Initialize with an empty array
  const [tilesData, setTilesData] = React.useState([]);

  React.useEffect(() => {
    async function getTilesData() {
      try {
        const response = await fetch('http://localhost:4000/memory');
        const data = await response.json();
        console.log("here is the data", data);
        // Ensure the data is an array before setting state
        if (Array.isArray(data.memories)) {
          setTilesData(data.memories);
        } else {
          console.error('Error: Data is not an array', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getTilesData();
    console.log("tilesData", tilesData);
  }, []);

  const handleEdit = (id) => {
    alert(`Edit tile with ID: ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete tile with ID: ${id}`);
  };

  const handleCreateMemory = () => {
    window.location.href = '/create-memory';
  };

  return (
    <div style={styles.galleryPage}>
      <button style={styles.createButton} onClick={handleCreateMemory}>
        Create Memory
      </button>
      <div style={styles.galleryContainer}>
        {/* Conditional rendering to ensure tilesData is an array before mapping */}
        {Array.isArray(tilesData) && tilesData.length > 0 ? (
          tilesData.map((tile) => (
            <MemoryTile
              key={tile._id}
              title={tile.title}
              description={tile.description}
              image={tile.mediaUrl}
              audio={tile.recordingUrl}
              onEdit={() => handleEdit(tile.id)}
              onDelete={() => handleDelete(tile.id)}
            />
          ))
        ) : (
          <p>No memories found.</p> // Add a message or loading state
        )}
      </div>
    </div>
  );
};

export default Gallery;

const styles = {
  galleryPage: {
    position: 'relative',
    padding: '20px',
  },
  createButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  galleryContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '50px',
  },
};
