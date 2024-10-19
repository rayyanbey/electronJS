import { app, BrowserWindow} from "electron";
import path from "path";


const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV !== "production";


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

app.whenReady().then(()=>{
    createMainWindow();
}); 


app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});


app.on("activate",()=>{
  if(BrowserWindow.getAllWindows().length === 0){
    createMainWindow();
  }
})