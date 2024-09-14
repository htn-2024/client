import React, { useState, useEffect, useRef } from 'react';

const MyForm = () => {
  const [accessToken, setAccessToken] = useState('')
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [music, setMusic] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

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
 
  const search = async () => {
    const songParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }

    const response = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track`, songParams);
    const result = await response.json();
    setMusic(result.tracks.items[0].preview_url);
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleVoiceRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  // Function to upload the file
  const uploadFile = async (file) => {
    try {
      const response = await fetch('http://localhost:4000/upload', {
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

  // Function to create memory object
  const createMemory = async (mediaFileId, recordingFileId) => {
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
      const response = await fetch('http://localhost:4000/memory', {
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
  };


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        const audioURL = window.URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioURL;
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Error accessing the microphone', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('Recording stopped');
    }
  };

  return (
    <div>
      <h1>Create Form</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <br />
        <input
          type="title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Title"
        />
        <br />
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Enter description"
        />
        <br />
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder="Enter the Spotify link"
          />
          <button type="button" onClick={search}>
            Search Song
          </button>
        </div>

        <button type="button" onClick={handleVoiceRecording}>
          {isRecording ? 'Stop Recording' : 'Record Voice'}
        </button>
        <br />

        <audio ref={audioRef} controls />
        <br />

        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default MyForm;
