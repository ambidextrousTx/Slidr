import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { scanMediaDirectory } from './mediaLoader.js'
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


function createWindow() {
  const imageFolder = process.argv[2]
  if (!imageFolder) {
    console.error('Please provide the path to a folder containing images')
    app.quit()
    return
  }
  const win = new BrowserWindow({
    width: 1200,
    height: 1200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    }
  })

  win.loadFile('index.html')
}

ipcMain.handle('dialog:open-folder', async (event, options) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Select Media Folder'
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('get-cli-arg', () => process.argv[2]);

ipcMain.handle('load-media', async (event, folderPath) => {
  try {
    const media = await scanMediaDirectory(folderPath);
    return media;
  } catch (err) {
    console.error('Load media failed:', err);
    throw err; // Let renderer handle error
  }

});

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit()
  }
})
