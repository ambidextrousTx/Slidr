const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to renderer, keeping core Node logic isolated away
contextBridge.exposeInMainWorld('electronAPI', {
  openFolderDialog: () => ipcRenderer.invoke('dialog:open-folder'),
  loadMedia: (folderPath) =>  ipcRenderer.invoke('load-media', folderPath),
  getCliArg: () => ipcRenderer.invoke('get-cli-arg'),
  getLastFolder: () => ipcRenderer.invoke('get-last-folder'),
  setLastFolder: (folderPath) => ipcRenderer.invoke('set-last-folder', folderPath)
});

