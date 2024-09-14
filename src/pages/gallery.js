import React from "react";
import MemoryTile from "../components/memoryTile";

const Gallery = () => {
  // Initialize with an empty array
  const [tilesData, setTilesData] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTile, setEditingTile] = React.useState(null);

  React.useEffect(() => {
    async function getTilesData() {
      try {
        const response = await fetch("http://localhost:4000/memory");
        const data = await response.json();
        console.log("here is the data", data);
        // Ensure the data is an array before setting state
        if (Array.isArray(data.memories)) {
          setTilesData(data.memories);
        } else {
          console.error("Error: Data is not an array", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getTilesData();
    console.log("tilesData", tilesData);
  }, []);

  React.useEffect(() => {
    console.log("Updated tilesData:", tilesData);
  }, [tilesData]);

  const handleEdit = (tile) => {
    setEditingTile(tile);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:4000/memory/${editingTile._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingTile),
        }
      );

      if (response.ok) {
        const updatedMemory = await response.json();
        setTilesData((prevTilesData) =>
          prevTilesData.map((tile) =>
            tile._id === editingTile._id ? { ...tile, ...updatedMemory } : tile
          )
        );
        setIsModalOpen(false);
        setEditingTile(null);
      } else {
        console.error("Failed to update memory");
      }
    } catch (error) {
      console.error("Error updating memory:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/memory/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Remove the deleted tile from the state
        setTilesData(tilesData.filter((tile) => tile._id !== id));
        console.log("tilesData has been deleted", tilesData);
      }
    } catch (error) {
      console.error("Error deleting memory:", error);
    }
  };

  const handleCreateMemory = () => {
    window.location.href = "/create-memory";
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
              spotifyLink={tile.spotifyLink}
              fileLink={tile.fileLink}
              onEdit={() => handleEdit(tile)}
              onDelete={() => handleDelete(tile._id)}
            />
          ))
        ) : (
          <p>No memories found.</p> // Add a message or loading state
        )}
      </div>
      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Edit Memory</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="title">Title:</label>
              <input
                id="title"
                type="text"
                value={editingTile.title}
                onChange={(e) =>
                  setEditingTile({ ...editingTile, title: e.target.value })
                }
              />
              <br />
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={editingTile.description}
                onChange={(e) =>
                  setEditingTile({
                    ...editingTile,
                    description: e.target.value,
                  })
                }
              />
              <br />
              <label htmlFor="spotifyLink">Spotify Link:</label>
              <input
                id="spotifyLink"
                type="text"
                value={editingTile.spotifyLink}
                onChange={(e) =>
                  setEditingTile({
                    ...editingTile,
                    spotifyLink: e.target.value,
                  })
                }
              />
              <br />
              <label htmlFor="fileLink">File Link:</label>
              <input
                id="fileLink"
                type="text"
                value={editingTile.fileLink}
                onChange={(e) =>
                  setEditingTile({ ...editingTile, fileLink: e.target.value })
                }
              />
              <br />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

const styles = {
  galleryPage: {
    position: "relative",
    padding: "20px",
  },
  createButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  galleryContainer: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: "50px",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
  },
};
