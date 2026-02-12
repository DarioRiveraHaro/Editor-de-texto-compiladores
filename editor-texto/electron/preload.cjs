const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onFileOpened: (callback) =>
    ipcRenderer.on("file-opened", (_event, value) => callback(value)),

  onRequestSave: (callback) => ipcRenderer.on("request-save", () => callback()),

  sendContentToSave: (content) =>
    ipcRenderer.send("send-content-to-save", content),
});
