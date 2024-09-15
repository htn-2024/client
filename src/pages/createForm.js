import React, { useState, useEffect, useCallback } from 'react';
import './createForm.css';
import frameyCreate from '../images/frameyCreate.svg';
import UploadFile from '../components/uploadFile.js';
import Dropdown from '../components/dropdown.js';
import TextInput from '../components/textInput.js';
import TextArea from '../components/textArea.js';
import SearchDropdown from '../components/searchDropdown.js';
import VoiceRecording from '../components/voiceRecording.js';
import CancelIcon from '@mui/icons-material/Cancel';

const MyForm = () => {
  const [collectionsData, setCollectionsData] = useState([]);
  const [collection, setCollection] = useState(null);
  const [accessToken, setAccessToken] = useState('')
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [audioBlob, setAudioBlob] = useState(null);
  const [music, setMusic] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  useEffect(() => {
    const authParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=client_credentials&client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&client_secret=${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`
    }
    fetch('https://accounts.spotify.com/api/token', authParams)
      .then(res => res.json())
      .then(data => setAccessToken(data.access_token));
  }, []);

  useEffect(() => {
    getCollectionsData();
  }, [getCollectionsData]);

  useEffect(() => {
    if (!accessToken) return;
    const fetchSongs = async () => {
      const songParams = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }

      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track`, songParams);
      const result = await response.json();
      const options = result?.tracks?.items?.filter((track) => track.preview_url).map((track) => (
        { label: track.name, value: track.preview_url }
      ));
      setOptions(options);
      setIsDropdownOpen(true);
    }
    const debounceTimeout = setTimeout(fetchSongs, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, accessToken]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleCancel = (e) => {
    window.location.href = '/gallery';
  };

  // Function to upload the file
  const uploadFile = async (file) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/upload`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        console.log('File upload failed, line 86 ---------');
        throw new Error('File upload failed');
      }

      const result = await response.json();
      console.log("result is typeof", typeof(result));
      console.log('File uploaded successfully:', result);

      // Assuming the response contains a file URL or ID
      return result.storageId;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };
  console.log(music);
  // Function to create memory object
  const createMemory = async (mediaFileId, recordingFileId) => {
    console.log(music);
    const memoryData = {
      title,
      description,
      music,
      mediaFileId,
      recordingFileId, // Use the uploaded file's URL or ID
      // audioBlob, // You can send additional data like audio if needed
    };

    console.log("here is the memory data", memoryData);

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/memory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memoryData),
      });

      if (!response.ok) {
        throw new Error('Memory creation failed');
      }

      const result = await response.json();
      console.log('Memory created successfully:', result);
    } catch (error) {
      console.error('Error creating memory:', error);
    }
  };

  const handleSubmit = async (e) => {
  /**
   * Handles the form submission by:
   * 1. Uploading the selected media file and get the file URL or ID.
   * 2. Uploading the recorded audio blob and get the file URL or ID.
   * 3. Creating a new memory object with the file URLs and additional data.
   * 4. Redirecting the user to the gallery page after successful creation.
   * @param {Event} e The form submission event.
   */
    e.preventDefault();
    setIsUploading(true);

    // Step 1: Upload the file and get the file URL or ID
    const mediaFileId = await uploadFile(file);
    if (!mediaFileId) {
      alert('Media file upload failed. Please try again.');
      setIsUploading(false);
      return;
    }

    const recordingFileId = await uploadFile(audioBlob);
    if (!recordingFileId) {
      alert('Recording file id failed. Please try again.');
      setIsUploading(false);
      return;
    }
    // Step 2: Create memory object with the file URL
    await createMemory(mediaFileId, recordingFileId);

    setIsUploading(false);
    alert('Memory created successfully!');
    window.location.href = '/gallery';
  };

  return (
    <div className="container">
      <CancelIcon className='cancel-icon' onClick={handleCancel}/>
      <section className="header">
        <h1 className="blue sub-text">Create Exhibit</h1>
        <img src={frameyCreate} alt="framey cartoon mascot" className='framey-create' height={200}/>
      </section>
      <form onSubmit={handleSubmit} className="form">
        <UploadFile file={file} handleFileChange={handleFileChange}/>
        <div className="inputs">        
          <Dropdown
            options={collectionsData}
            selected={collection}
            setSelected={setCollection}
            placeholder="Select a collection..."
          />
          <TextInput
            value={title}
            onChange={handleTitleChange}
            placeholder="Title"
          />
      
          <TextArea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter description"
          />
  
          <div>
            <SearchDropdown
              options={options}
              label={searchQuery}
              setLabel={setSearchQuery}
              placeholder="Search for a song..."
              isDropdownOpen={!music && isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setValue={setMusic}
            />
          </div>
          <VoiceRecording setAudioBlob={setAudioBlob} />
        </div>
        <button type="submit" className="submit text">Create</button>
      </form>
    </div>
  );
};

export default MyForm;
