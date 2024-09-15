import React, { useState, useEffect } from 'react';
import './uploadFile.css';
import upload from '../images/upload.svg';

const UploadFile = ({ file, handleFileChange }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    }

    reader.readAsDataURL(file);
  }, [file]);

  return (
    <>
      <label htmlFor="file-upload" className="file-upload">
        {previewUrl ? (
          <img src={previewUrl} alt="uploaded file" height="100%"/>
        ) : (
          <>
            <img src={upload} alt="upload icon" className='upload-icon'/>
            <div className="text">Click to upload a file...</div>
          </>
        )}
      </label>
      <input id="file-upload" type="file" className="file-input" onChange={handleFileChange} />
    </>
  )
};

export default UploadFile;