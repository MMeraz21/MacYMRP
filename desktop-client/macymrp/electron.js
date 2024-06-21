// electron.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { WebSocketServer } = require('ws');
const { EasyPresence } = require('easy-presence');

let mainWindow;
let wss;
let client;
console.log("hiii from electron.js")

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  const startURL = app.isPackaged
    ? `file://${path.join(__dirname, '../build/index.html')}`
    : 'http://localhost:3000';

  mainWindow.loadURL(startURL).catch(err => {
    console.error('Failed to load URL:', startURL, err);
  });

  mainWindow.on('closed', () => (mainWindow = null));

  // Start WebSocket server
  wss = new WebSocketServer({ port: 3030 });
  wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
      console.log('received: %s', data);

      const message = JSON.parse(data);
      if (!message) {
        return;
      }
      console.log(message);

      // Update Discord Rich Presence
      if (client) {
        console.log('sending ' + message.song)
        mainWindow.webContents.send('updateData', message)

        client.setActivity({
          details: message.song,
          state: "by " + message.artist,
          assets: {
            large_image: message.albumCover,
          },
        });
        // console.log('sending' + message.song)
        // mainWindow.webContents.send('updateData', message)

      }
    });

    ws.send('Connected to WebSocket server');
  });
}

app.on('ready', () => {
  createWindow();

  // Initialize EasyPresence client
  client = new EasyPresence("1182852142210494464");

  // Event listeners for EasyPresence
  client.on("connected", () => {
    console.log("Connected to Discord");
  });

  client.on("activityUpdate", (activity) => {
    console.log("Updated Discord Rich Presence");
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
