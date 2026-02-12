const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  // En desarrollo, apunta al servidor de Vite
  win.loadURL("http://localhost:5173");
}

// Manejador para LEER archivos
ipcMain.handle("read-file", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (!canceled) {
    return fs.readFileSync(filePaths[0], "utf8");
  }
});

// Manejador para GUARDAR archivos
ipcMain.handle("save-file", async (event, content) => {
  const { canceled, filePath } = await dialog.showSaveDialog();
  if (!canceled) {
    fs.writeFileSync(filePath, content);
    return true;
  }
});

app.whenReady().then(createWindow);
