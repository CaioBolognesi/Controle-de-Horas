"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = __importDefault(require("electron"));
const server_1 = __importDefault(require("./src/server"));
let apiServer;
let window;
const createWindow = () => {
    if (window)
        return;
    window = new electron_1.default.BrowserWindow({
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
electron_1.default.app.on("ready", () => {
    createWindow();
    (0, server_1.default)();
});
electron_1.default.app.on("before-quit", () => {
    if (apiServer) {
        apiServer.kill();
    }
});
electron_1.default.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.default.app.quit();
    }
    if (apiServer) {
        apiServer.kill();
    }
});
