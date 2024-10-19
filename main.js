import { app, BrowserWindow} from "electron";
import path from "path";
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "ImageShrink",
    width: 500,
    height: 600
  });

  //mainWindow.loadURL('https://portfolio-hazel-xi-80.vercel.app/')
  mainWindow.loadFile("client/index.html");
}



app.whenReady().then(()=>{
    createMainWindow();
}); 

