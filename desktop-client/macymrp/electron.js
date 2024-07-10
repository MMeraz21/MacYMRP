// electron.js
const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const { WebSocketServer } = require('ws');
const { EasyPresence } = require('easy-presence');
const tint = require("electron-tinted-with-sidebar");
const { menubar} = require("menubar")
//require('@electron/remote/main').initialize();

let mainWindow;
let wss;
let client;
let tray;
console.log("hiii from electron.js")
//app.commandLine.appendSwitch('apple-internal', 'LSUIElement'); // Set LSUIElement to hide from dock

console.log(process.env.APP_URL)

const startURL = app.isPackaged
? `file://${path.join(__dirname, '../build/index.html')}`
: 'http://localhost:3000';

// const mb = menubar({
//   index: startURL,
//   // browserWindow: {
//   //   //icon: path.resolve(__dirname, 'trayIcon.png'),
//   //   width: 800,
//   //   height: 600,
//   //   minHeight: 400,
// 	// 	minWidth: 500,
//   //   // frame: true,
//   //   show: false,
//   //   titleBarStyle: "hidden",
// 	// 	vibrancy: "sidebar",
//   //   webPreferences: {
//   //     preload: path.join(__dirname, 'preload.js'),
//   //     contextIsolation: true,
//   //     //enableRemoteModule: true,
//   //   }
//   // }
// });

// mb.on('ready', () => {
//   console.log('app is ready');
//   // your app code here
// });


function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'trayIcon.png'),
    width: 800,
    height: 600,
    minHeight: 400,
		minWidth: 500,
    // frame: true,
    show: false,
    titleBarStyle: "hidden",
		vibrancy: "sidebar",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      //enableRemoteModule: true,
    },
  });

  //mainWindow.setVibrancy('sidebar'); // Example: 'full-window'
	// tint.setWindowAnimationBehavior(mainWindow.getNativeWindowHandle(), true);
	// tint.setWindowLayout(mainWindow.getNativeWindowHandle(), 200, 52);

  mainWindow.setWindowButtonPosition({ x: 19, y: 18 });



  // const startURL = app.isPackaged
  //   ? `file://${path.join(__dirname, '../build/index.html')}`
  //   : 'http://localhost:3000';

console.log(startURL)

  mainWindow.loadURL(startURL).catch(err => {
    console.error('Failed to load URL:', startURL, err);
  });

  mainWindow.on('closed', () => (mainWindow = null));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
});


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

  const trayIconPath = path.resolve(__dirname, 'trayIcon.png');
  console.log('Tray icon path:', trayIconPath);   
  
  try {
    tray = new Tray(trayIconPath);
  } catch (error) {
    console.error('Failed to load tray icon:', error);
    app.quit();
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: function () {
        mainWindow.show();
      },
    },
    {
      label: 'Quit',
      click: function () {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Your App Name');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  app.dock.hide();


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
