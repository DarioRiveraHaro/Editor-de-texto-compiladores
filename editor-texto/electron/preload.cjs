const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  readFile: () => ipcRenderer.invoke("read-file"),
  saveFile: (content) => ipcRenderer.invoke("save-file"),
});
