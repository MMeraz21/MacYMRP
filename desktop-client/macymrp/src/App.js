import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [currentSong, setCurrentSong] = useState({
    song: '',
    artist: '',
    albumCover: ''
  });

  useEffect(() => {
    const handleUpdateData = (event, data) => {
      if (data) {
        setCurrentSong(data);
      }
    };

    window.electron.ipcRenderer.on('updateData', handleUpdateData);

    return () => {
      window.electron.ipcRenderer.removeListener('updateData', handleUpdateData);
    };
  }, []);

  return (
    <div className="App">
      <div className="sidebar">
        sidebar
      </div>
      <header className="main-content">
        <h1>Now Playing</h1>
        <div>
          <h2>Song: {currentSong.song || 'No song playing'}</h2>
          <h3>Artist: {currentSong.artist || 'Unknown artist'}</h3>
          {currentSong.albumCover ? (
            <img src={currentSong.albumCover} alt="Album Cover" />
          ) : (
            <p>No album cover available</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
