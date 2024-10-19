import { app, BrowserWindow, Menu} from "electron";
import path from "path";


const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV !== "production";

//Create the main window
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "ImageShrink",
    width: isDev? 1000: 500,
    height: 600
  });

  //open dev tool if in dev env
  if(isDev){
    mainWindow.webContents.openDevTools();
  }
  //mainWindow.loadURL('https://portfolio-hazel-xi-80.vercel.app/')
  mainWindow.loadFile("client/theme/index.html");
}

//App is ready


app.whenReady().then(()=>{
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

const menu ={
  label:"File",
  submenu:{
    label: "Quit",
    click: ()=> app.quit(),
    accelerator: "CmdOrCtrl+W"
  }
}


app.on("activate",()=>{
  if(BrowserWindow.getAllWindows().length === 0){
    createMainWindow();
  }
})