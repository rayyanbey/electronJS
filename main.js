const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const path = require("path");
const os = require('os');
const fs = require('fs');
const resizeImg = require('resize-img');

const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV !== "production";

let mainWindow;

// Create the main window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "ImageShrink",
    width: isDev ? 1000 : 500,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile("client/theme/index.html");
}

// Create about window
function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    title: "About ImageShrink",
    width: 300,
    height: 300,
  });

  aboutWindow.loadFile("client/theme/about.html");
}

// App is ready
app.whenReady().then(() => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
});



app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// Menu Template
const menu = [
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { label: 'About', click: createAboutWindow }
    ]
  }] : []),
  { role: 'fileMenu' },
  ...(!isMac ? [{
    label: 'Help',
    submenu: [
      { label: 'About', click: createAboutWindow }
    ]
  }] : [])
];


ipcMain.on('image:resize', async (e, options) => {
  const { imgData, width, height } = options;
  const dest = path.join(os.homedir(), 'imageshrink');
  console.log("Received options:", options);
  
  try {
    await resizeImage(imgData, width, height, dest);
    mainWindow.webContents.send('image:done');
    shell.openPath(dest);
  } catch (error) {
    console.error(error.message);
    mainWindow.webContents.send('image:resize-error', error.message);
  }
});

async function resizeImage(imgData, width, height, dest) {
  const newImg = await resizeImg(Buffer.from(imgData), {
    width: +width,  // Cast to number
    height: +height  // Cast to number
  });

  const filename = 'resized_image.png';
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
  fs.writeFileSync(path.join(dest, filename), newImg);
}
