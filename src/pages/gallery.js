import React, { useState, useCallback, useEffect } from "react";
import MemoryTile from "../components/memoryTile";
import Dropdown from "../components/dropdown";
import TextInput from "../components/textInput";
import TextArea from "../components/textArea";
import { ReactComponent as FrameyGallery } from "../images/frameyGallery.svg";
import "./gallery.css";
import { CircularProgress } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const Gallery = () => {
  const [collectionsData, setCollectionsData] = useState([]);
  const [collection, setCollection] = useState(null);
  const [newCollection, setNewCollection] = useState("");
  const [tilesData, setTilesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTile, setEditingTile] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCollectionsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/collection`
      );
      const data = await response.json();
      if (Array.isArray(data.collections)) {
        const options = data.collections.map((collection) => ({
          label: collection.name,
          value: collection._id,
        }));
        setCollectionsData(options);
      } else {
        console.error("Error: Data is not an array", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  }, []);

  // Fetch the tiles data from the server
  const getTilesData = useCallback(async (collection) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/memory${
          collection?.value ? "/" + collection.value : ""
        }`
      );
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
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getCollectionsData();
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
        setOpenDropdownId(null); // Close the dropdown
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
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/memory/${id}`,
        {
          method: "DELETE",
        }
      );
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
  };

  const handleCreateCollection = async () => {
    await fetch(`${process.env.REACT_APP_SERVER_URL}/collection`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newCollection }),
    });
    setNewCollection("");
    getCollectionsData();
  };

  const handleCreateMemory = () => {
    window.location.href = "/create-memory";
  };

  if (isLoading) {
    return <div className="spinner"><CircularProgress /></div>
  }

  return (
    <div style={styles.galleryPage}>
      <div className="gallery-options">
        <div className="collection-filter text">
          <Dropdown
            options={collectionsData}
            selected={collection}
            setSelected={setCollection}
            placeholder="Filter by collection"
            variant="transparent"
          />
        </div>
        <div className='collection'>
        <button className='collection-btn text' onClick={handleCreateCollection}>
            <AddIcon className='add-icon' />
            New Collection
          </button>
          <div className="collection-input">
            <TextInput
              value={newCollection}
              onChange={handleNewCollectionChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateCollection(e);
                }
              }}
              placeholder="Input new collection..."
              variant="transparent"
            />
          </div>
        </div>
        <button className='add-button log-mem-btn text' onClick={handleCreateMemory}>
          <AddIcon className='add-icon' />
          Add memory
        </button>
      </div>
      <div className="header">
        <FrameyGallery />
        <h1 className="sub-text">Welcome to your Memory Museum!</h1>
      </div>
      <div className='mem-tile' style={styles.galleryContainer}>
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
              setDropdownOpen={(isOpen) =>
                setOpenDropdownId(isOpen ? tile._id : null)
              }
            />
          ))
        ) : (
          <p>No memories found.</p>
        )}
      </div>
      {isModalOpen && editingTile && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalBody}>
              {/* Left side: Image */}
              <div style={styles.imageContainer}>
                <img
                  src={editingTile.mediaUrl} // Display the image
                  alt={editingTile.title}
                  style={styles.sideImage}
                />
              </div>

              {/* Right side: Form Fields */}
              <div style={styles.formContainer}>
                <h2 className='edit-title sub-text'>Edit Memory Exhibit</h2>
                <form onSubmit={handleSubmit} className="form">
                  <div className="inputs">
                    <TextInput
                      value={editingTile.title} // Pre-populated with the memory's title
                      onChange={(e) =>
                  setEditingTile({ ...editingTile, title: e.target.value })
                }
                      placeholder="Title"
                    />

                    <TextArea
                      value={editingTile.description} // Pre-populated with the memory's description
                      onChange={(e) =>
                  setEditingTile({
                    ...editingTile,
                    description: e.target.value,
                  })
                }
                      placeholder="Enter description"
                    />
                  </div>

                  {/* Bottom right: Update button */}
                  <div style={styles.buttonContainer}>
                    <button
                      type="submit"
                      className="update text"
                      onClick={async (e) => {
                        await handleSubmit(e);
                        setIsModalOpen(false);
                        setEditingTile(null);
                      }}
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
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
    backgroundColor: "#F0EFE9",
    padding: "20px",
    borderRadius: "5px",
    height: "350px",
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    borderRadius: "16px"
  },
  sideImage: {
    width: "200px",
    borderRadius: "8px",
    margin: "16px",
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  modalBody: {
    display: "flex",
    flexDirection: "row",
    spaceBetween: "15px",
    marginRight: "30px",
  },
  buttonContainer: {
    display: "absolute",
    flexDirection: "column",
    justifyContent: "flex-bottom",
  }
};

