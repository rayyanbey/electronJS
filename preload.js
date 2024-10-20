const { channel } = require("diagnostics_channel");
const { contextBridge, ipcRenderer } = require("electron");
const os = require('os');
const path = require('path');
const Toastify = require('toastify-js');

// This file is a bridge between the node js and front end js
// it allows us to use the node js modules in the front end like performing file operations and os operations etc

contextBridge.exposeInMainWorld("os", {
    homedir: () => os.homedir()
});

contextBridge.exposeInMainWorld("path", {
    join: (...args) => path.join(...args)
});


contextBridge.exposeInMainWorld("Toastify", {
    toast: (options) => Toastify(options).showToast()
});


contextBridge.exposeInMainWorld("ipcRenderer", {
    send: (channel,data)=> ipcRenderer.send(channel,data),
    on: (channel,func) => ipcRenderer.on(channel,(e,...args)=> func(...args))
});