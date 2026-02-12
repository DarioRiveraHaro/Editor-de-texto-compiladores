const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Para escuchar cuando el menú nativo abre algo
  onFileOpened: (callback) =>
    ipcRenderer.on("file-opened", (_event, value) => callback(value)),

  // Para escuchar cuando el menú pide guardar
  onRequestSave: (callback) => ipcRenderer.on("request-save", () => callback()),

  // Para enviar el texto de vuelta al proceso principal y guardarlo
  sendContentToSave: (content) =>
    ipcRenderer.send("send-content-to-save", content),
});
