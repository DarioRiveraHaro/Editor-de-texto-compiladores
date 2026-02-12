const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow; // La guardamos globalmente para usarla en el menú

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  mainWindow.loadURL("http://localhost:5173");

  // 1. Definir el menú
  const template = [
    {
      label: "File", // O 'Archivo'
      submenu: [
        {
          label: "Abrir",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            const { canceled, filePaths } = await dialog.showOpenDialog();
            if (!canceled) {
              const content = fs.readFileSync(filePaths[0], "utf8");
              // Enviamos el contenido a React
              mainWindow.webContents.send("file-opened", content);
            }
          },
        },
        {
          label: "Guardar",
          accelerator: "CmdOrCtrl+S",
          click: () => {
            // Le pedimos a React que nos mande el texto actual para guardarlo
            mainWindow.webContents.send("request-save");
          },
        },
        { type: "separator" },
        { label: "Salir", role: "quit" },
      ],
    },
    { label: "Edit", role: "editMenu" }, // Opciones estándar como copiar/pegar
    { label: "View", role: "viewMenu" },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Handler para cuando React responde al "request-save"
ipcMain.on("send-content-to-save", async (event, content) => {
  const { canceled, filePath } = await dialog.showSaveDialog();
  if (!canceled) {
    fs.writeFileSync(filePath, content);
  }
});

app.whenReady().then(createWindow);
