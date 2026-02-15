import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'node:fs/promises';
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
    const mediaExtensions = new Set([
      '.jpg', '.jpeg', '.png', '.gif', '.avif', '.webp', '.mp4', '.webm'
    ]);

    const result = [];

    /**
   * Recursive helper function
   * @param {string} currentDir
   */
    async function scanDir(currentDir) {
      try {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);

          if (entry.isDirectory()) {
            // Recurse into subdirectory
            await scanDir(fullPath);
          }
          else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (mediaExtensions.has(ext)) {
              result.push(fullPath);
            }
          }
        }
      } catch (err) {
        console.warn(`Could not read directory ${currentDir}:`, err.message);
      }
    }

    await scanDir(folderPath);
    console.log(`Loaded ${result.length} media files from ${folderPath}`);
    return result;
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
