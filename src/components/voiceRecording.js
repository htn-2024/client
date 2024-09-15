import React from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import './voiceRecording.css';

const VoiceRecording = ({ setAudioBlob }) => {
  return (
    <ReactMediaRecorder
      video={false}
      audio={true}
      render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
        <div className="recording">
          <button className="record-button" type="button" onClick={status === 'recording' ? stopRecording : startRecording}>
            {status === 'recording' ? 'Stop Recording' : 'Record Voice'}
          </button>
          <audio src={mediaBlobUrl} controls />
        </div>
      )}
      onStop={(_, blob) => setAudioBlob(blob)}
    />
  )
};

export default VoiceRecording;