import electron from "electron";
import proccess from "node:child_process";
import startServer from "./src/server";

let apiServer: proccess.ChildProcess;
let window: electron.BrowserWindow;

const createWindow = () => {
  if (window) return;
  window = new electron.BrowserWindow({
    width: 400,
    height: 720,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  window.loadFile(__dirname + "/src/client/index.html");
};

electron.app.on("ready", () => {
  createWindow();
  startServer();
});

electron.app.on("before-quit", () => {
  if (apiServer) {
    apiServer.kill();
  }
});

electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
  if (apiServer) {
    apiServer.kill();
  }
});
