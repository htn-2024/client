import React, { useState, useCallback, useEffect } from "react";
import MemoryTile from "../components/memoryTile";
import Dropdown from "../components/dropdown";
import TextInput from "../components/textInput";
import { ReactComponent as FrameyGallery } from '../images/frameyGallery.svg';
import './gallery.css';
import AddIcon from '@mui/icons-material/Add';

const Gallery = () => {
  const [collectionsData, setCollectionsData] = useState([]);
  const [collection, setCollection] = useState(null);
  const [newCollection, setNewCollection] = useState("");
  const [tilesData, setTilesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTile, setEditingTile] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const getCollectionsData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/collection`);
      const data = await response.json();
      if (Array.isArray(data.collections)) {
        const options = data.collections.map((collection) => (
          { label: collection.name, value: collection._id }
        ))
        setCollectionsData(options);
      } else {
        console.error("Error: Data is not an array", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  // Fetch the tiles data from the server
  const getTilesData = useCallback(async (collection) => {
    console.log(collection)
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/memory${collection?.value ? "/" + collection.value : ""}`);
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

  useEffect(() => {
    getCollectionsData()
  }, [getCollectionsData]);

  useEffect(() => {
    getTilesData(collection);
  }, [getTilesData, collection]);

  // Logging updated tilesData
  useEffect(() => {
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
        `${process.env.REACT_APP_SERVER_URL}/memory/${editingTile._id}`,
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
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/memory/${id}`, {
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

  const handleNewCollectionChange = (e) => {
    setNewCollection(e.target.value);
  }

  const handleCreateCollection = async () => {
    await fetch(`${process.env.REACT_APP_SERVER_URL}/collection`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newCollection }),
    });
    setNewCollection("");
    getCollectionsData();
  };

  const handleCreateMemory = () => {
    window.location.href = "/create-memory";
  };

  return (
    <div style={styles.galleryPage}>
      <div className="gallery-options">
        <div className="collection-input">
          <Dropdown
            options={collectionsData}
            selected={collection}
            setSelected={setCollection}
            placeholder="Filter by collection..."
            variant="transparent"
          />
        </div>
        <div className="collection-input">
          <TextInput
            value={newCollection}
            onChange={handleNewCollectionChange}
            placeholder="Create a new collection..."
            variant="transparent"
          />
        </div>
        <button className='add-button text' onClick={handleCreateCollection}>
          <AddIcon className='add-icon' />
          New Collection
        </button>
        <button className='add-button log text' onClick={handleCreateMemory}>
          <AddIcon className='add-icon' />
          Log memory
        </button>
      </div>
      <div className='header'>
        <FrameyGallery/>
        <h1 className='sub-text'>
          Welcome to your Memory Museum!
        </h1>
      </div>
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
