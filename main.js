const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const path = require("path");
const os = require('os')
const fs = require('fs');
const resizeImg = require('resize-img')

const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV !== "production";

//Create the main window
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "ImageShrink",
    width: isDev ? 1000 : 500,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  //open dev tool if in dev env
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  //mainWindow.loadURL('https://portfolio-hazel-xi-80.vercel.app/')
  mainWindow.loadFile("client/theme/index.html");
}

//Create about window
function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    title: "About ImageShrink",
    width: 300,
    height: 300,
  })

  aboutWindow.loadFile("client/theme/about.html");
}

//App is ready
app.whenReady().then(() => {
  createMainWindow();
  //Building and implementing the custom menu
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

//Menu Template
const menu = [
  ...(isMac ? [{
    label: app.name, submenu: [
      {
        label: 'About',
        click: createAboutWindow
      }
    ]
  }] : []),
  {
    role: 'fileMenu'
  },
  ...(!isMac) ? [{
    label: 'Help',
    submenu: [
      {
        label: 'About',
        click: createAboutWindow
      }
    ]
  }] : []
]

// Respond to ipcRenderer resize

ipcMain.on('image:resize',(e,options)=>{
  options.dest = path.join(os.homedir(),'imageshrink')
  resizeImage(options);
})

async function resizeImage({imgPath,width,height,dest}){
  try {
    const newPath = await resizeImg(fs.readFileSync(imgPath),{
      width: +width,
      height: +height
    });

    // Create filename
    const filename = path.basename(imgPath)

    //Create dest folder if don't exist
    if(!fs.existsSync(dest)){
      fs.mkdirSync(dest);
    }

    //Write file to dest folder
    fs.writeFileSync(path.join(dest,filename),newPath);

    //Send Success to render
    mainWindow.webContents.send('image:done')
    //Open dest folder 
    shell.openPath(dest)

  } catch (error) {
    console.log(error)
  }
}

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
})