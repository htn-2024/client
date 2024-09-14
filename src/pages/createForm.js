import React, { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../TokenContext';

const MyForm = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  // const { token } = useContext(TokenContext);

  const { token, setToken } = useContext(TokenContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    let storedToken = window.localStorage.getItem('token');

    if (!storedToken && hash) {
      const tokenParam = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'));

      if (tokenParam) {
        storedToken = tokenParam.split('=')[1];
        window.localStorage.setItem('token', storedToken);
        window.location.hash = ''; // Clear hash from URL
      }
    }

    setToken(storedToken || '');
    console.log('Token set in CreateForm:', storedToken);
    setLoading(false);
  }, [setToken]);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleVoiceRecording = () => {
    console.log('Voice recording started');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', { file, description, searchQuery, audioBlob });
  };

  const getSong = async () => {
    if (!searchQuery) {
      console.log('Search query is empty');
      return;
    }

    // Extract trackId from searchQuery (assuming it’s a Spotify URL)
    const parts = searchQuery.split('/');
    const trackId = parts[parts.length - 1];
    console.log("here is the trackId:", trackId);
    
    if (!token) {
      console.log('token is missing');
      return;
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();
      console.log('Spotify Track Data:', data);
    } catch (error) {
      console.error('Error fetching the track:', error);
    }
  };

  return (
    <div>
      <h1>Create Form</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
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
          <button type="button" onClick={getSong}>
            Submit Spotify Link
          </button>
        </div>
        <button type="button" onClick={handleVoiceRecording}>
          Record Voice
        </button>
        <br />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default MyForm;
