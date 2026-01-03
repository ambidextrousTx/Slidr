const { app, BrowserWindow } = require('electron')
const path = require('path')


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
      //preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false,
      additionalArguments: [imageFolder],
      sandbox: false
    }
  })

  win.loadFile('index.html')
}

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
