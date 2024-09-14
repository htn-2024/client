import React, { useRef, useState, useEffect } from 'react';

const MediaCapture = () => {
  const videoRef = useRef(null);
  const videoSaveRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);

  useEffect(() => {
    const constraintObj = { 
      audio: true, // enabling audio recording
      video: { 
        facingMode: "user", 
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 } 
      }
    };

    // Handle older browsers that might implement getUserMedia differently
    const handleGetUserMedia = async () => {
      try {
        const mediaStreamObj = await navigator.mediaDevices.getUserMedia(constraintObj);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStreamObj;
          videoRef.current.onloadedmetadata = () => videoRef.current.play();
        }

        const mediaRecorderInstance = new MediaRecorder(mediaStreamObj);
        setMediaRecorder(mediaRecorderInstance);

        mediaRecorderInstance.ondataavailable = (ev) => {
          setChunks((prevChunks) => [...prevChunks, ev.data]);
        };

        mediaRecorderInstance.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/mp4;' });
          const videoURL = window.URL.createObjectURL(blob);
          if (videoSaveRef.current) {
            videoSaveRef.current.src = videoURL;
          }
          setChunks([]); // Reset chunks after saving
        };
      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    };

    handleGetUserMedia();
  }, [chunks]);

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      console.log('Recording started');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      console.log('Recording stopped');
    }
  };

  return (
    <div>
      <h1>Media Capture Component</h1>
      <p>
        <button onClick={startRecording}>START RECORDING</button>
        <button onClick={stopRecording}>STOP RECORDING</button>
      </p>
      <video ref={videoRef} controls />
      <video ref={videoSaveRef} controls />
    </div>
  );
};

export default MediaCapture;
