import React, { useState, useRef, useCallback } from 'react';
import { VideoEditor } from './components/VideoEditor';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <VideoEditor />
    </div>
  );
}

export default App;