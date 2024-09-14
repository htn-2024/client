import React from "react";
import MemoryTile from "../components/memoryTile";

const Gallery = () => {
  const [tilesData, setTilesData] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTile, setEditingTile] = React.useState(null);
  const [openDropdownId, setOpenDropdownId] = React.useState(null);

  // Fetch the tiles data from the server
  const getTilesData = React.useCallback(async () => {
    try {
      const response = await fetch("http://localhost:4000/memory");
      const data = await response.json();
      console.log("Fetched updated tilesData", data);
      if (Array.isArray(data.memories)) {
        setTilesData(data.memories);
      } else {
        console.error("Error: Data is not an array", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  // Initial fetch of tiles data
  React.useEffect(() => {
    getTilesData();
  }, [getTilesData]);

  // Logging updated tilesData
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
        console.log("Memory updated successfully");
        setIsModalOpen(false);
        setEditingTile(null);
        setOpenDropdownId(null);  // Close the dropdown
        // Re-fetch updated tiles data after the edit
        await getTilesData();
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
        console.log("Memory deleted successfully");
        // Remove the deleted tile from the state
        setTilesData((prevTilesData) =>
          prevTilesData.filter((tile) => tile._id !== id)
        );
      } else {
        console.error("Failed to delete memory");
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
              isDropdownOpen={openDropdownId === tile._id}
              setDropdownOpen={(isOpen) => setOpenDropdownId(isOpen ? tile._id : null)}
            />
          ))
        ) : (
          <p>No memories found.</p>
        )}
      </div>
      {isModalOpen && editingTile && (
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
              <button 
                type="submit"
                onClick={async (e) => {
                  await handleSubmit(e);
                  setIsModalOpen(false);
                  setEditingTile(null);
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTile(null);
                }}
              >
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

