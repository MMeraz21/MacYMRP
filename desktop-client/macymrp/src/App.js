import React, { useEffect, useState } from 'react';
import './App.css';
//const { remote } = window.require('electron')


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

  //const { remote } = window.require('electron')

  // function closeWindow() {
  //   const window = window.electron.remote.getCurrentWindow();
  //   window.close();
  // }
  
  // function minimizeWindow() {
  //   const window = window.electron.remote.getCurrentWindow();
  //   window.minimize();
  // }
  
  // function maximizeWindow() {
  //   const window = window.electron.remote.getCurrentWindow();
  //   if (!window.isMaximized()) {
  //     window.maximize();
  //   } else {
  //     window.unmaximize();
  //   }
  // }

  return (
    <div className="App">

      {/* <div className="title-bar">
        <div className="controls">
        </div>
      </div> */}

    <div className="main-container">
      <div className="sidebar">
        sidebar
        <div class="shadow"></div>
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
      
    </div>
  );
}

export default App;
