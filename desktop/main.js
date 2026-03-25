const path = require("path");
const { app, BrowserWindow } = require("electron");
const express = require("express");

let server;

function publicDir() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "public");
  }
  return path.join(__dirname, "..");
}

function startStaticServer() {
  const web = express();
  web.use(express.static(publicDir()));

  return new Promise((resolve) => {
    server = web.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve(port);
    });
  });
}

async function createWindow() {
  const port = await startStaticServer();

  const win = new BrowserWindow({
    width: 1100,
    height: 760,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true
    }
  });

  await win.loadURL(`http://127.0.0.1:${port}/index.html`);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (server) {
    server.close();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});
