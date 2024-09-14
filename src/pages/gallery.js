import React from 'react';
import MemoryTile from '../components/memoryTile';

const Gallery = () => {
  // Example array of tile data
  const tilesData = [
    {
      id: 1,
      title: 'First Tile',
      description: 'Description of the first tile',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: 'Second Tile',
      description: 'Description of the second tile',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      title: 'Third Tile',
      description: 'Description of the third tile',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 4,
      title: 'Fourth Tile',
      description: 'Description of the fourth tile',
      image: 'https://via.placeholder.com/150',
    },
  ];

  const handleEdit = (id) => {
    alert(`Edit tile with ID: ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete tile with ID: ${id}`);
  };

  return (
    <div style={styles.galleryContainer}>
      {tilesData.map((tile) => (
        <MemoryTile
          key={tile.id}
          title={tile.title}
          description={tile.description}
          image={tile.image}
          onEdit={() => handleEdit(tile.id)}
          onDelete={() => handleDelete(tile.id)}
        />
      ))}
    </div>
  );
};

export default Gallery;

const styles = {
  galleryContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};
