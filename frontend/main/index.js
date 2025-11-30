const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// --- 1. เรียกใช้ electron-serve (ตัวแก้ปัญหา path) ---
const serveLib = require('electron-serve');
let serve;
// เช็คป้องกัน Error "serve is not a function"
if (typeof serveLib === 'function') {
    serve = serveLib;
} else {
    serve = serveLib.default;
}

// บอกให้ serve รู้ว่าไฟล์ HTML/CSS/JS อยู่ที่โฟลเดอร์ out
const appServe = serve({ directory: path.join(__dirname, '../out') });
// ---------------------------------------------------

let mainWindow;
let backendProcess;

const getBackendPath = () => {
    const isProd = app.isPackaged;
    if (isProd) {
        return path.join(process.resourcesPath, 'extra', 'backend.exe');
    }
    return null;
};

const startBackend = () => {
    const backendPath = getBackendPath();
    if (backendPath && fs.existsSync(backendPath)) {
        backendProcess = spawn(backendPath, [], { stdio: 'ignore', windowsHide: true });
    }
};

const killBackend = () => {
    if (backendProcess) {
        backendProcess.kill();
        backendProcess = null;
    }
};

const createWindow = async () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    const isProd = app.isPackaged;

    if (isProd) {
        // --- 2. ใช้ appServe โหลด URL แทน loadFile ---
        // มันจะแปลง path เป็น app://-/_next/... ซึ่ง Next.js เข้าใจ
        await mainWindow.loadURL('app://-');
    } else {
        mainWindow.loadURL('http://localhost:3000');
    }
};

app.whenReady().then(async () => {
    startBackend();

    // รอให้ serve เตรียมไฟล์เสร็จก่อน
    if (app.isPackaged) {
        // เรียกฟังก์ชันเพื่อ init protocol แต่ไม่ต้องรอผลลัพธ์ตรงนี้ก็ได้
        // เพราะเราไปรอตอน loadURL ใน createWindow แล้ว
    }

    await createWindow();
});

app.on('window-all-closed', () => {
    killBackend();
    if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
    killBackend();
});