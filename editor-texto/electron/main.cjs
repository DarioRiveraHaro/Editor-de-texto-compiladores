const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Editor de Texto - Sin título",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  mainWindow.loadURL("http://localhost:5173");

  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Nuevo",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            mainWindow.setTitle("Editor de Texto - Sin título");

            mainWindow.webContents.send("new-file");
          },
        },
        {
          label: "Abrir",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            const { canceled, filePaths } = await dialog.showOpenDialog();
            if (!canceled) {
              const content = fs.readFileSync(filePaths[0], "utf8");
              const filePath = filePaths[0];
              const fileName = path.basename(filePath);

              mainWindow.setTitle(`Editor de Texto - ${fileName}`);

              mainWindow.webContents.send("file-opened", content);
            }
          },
        },
        {
          label: "Guardar",
          accelerator: "CmdOrCtrl+S",
          click: () => {
            mainWindow.webContents.send("request-save");
          },
        },
        { type: "separator" },
        { label: "Salir", role: "quit" },
      ],
    },
    { label: "Edit", role: "editMenu" },
    { label: "View", role: "viewMenu" },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

ipcMain.on("send-content-to-save", async (event, content) => {
  const { canceled, filePath } = await dialog.showSaveDialog();
  if (!canceled) {
    fs.writeFileSync(filePath, content);
    const fileName = path.basename(filePath);
    mainWindow.setTitle(`Editor de Texto - ${fileName}`);
  }
});

app.whenReady().then(createWindow);
