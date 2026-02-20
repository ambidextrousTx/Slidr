import { shuffleArray } from './slideshowUtils.js'
import { SlideshowController } from './slideshowController.js'

const slideShowElement = document.getElementById('slideshow-image')
const controller = new SlideshowController(slideShowElement, {
  interval: 3000,
  resumeDelayMs: 15000 
})

let currentFolder = null;

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    controller.next();
    controller.userInteracted();
  }
  else if (event.key === 'ArrowLeft') {
    controller.prev();
    controller.userInteracted();
  } else if (event.key === 'F') {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      // Exit fullscreen
      document.exitFullscreen().catch(err => {
        console.error('Exit fullscreen failed:', err);
      });
    }
  }
});

document.getElementById('choose-folder-btn').addEventListener('click', async () => {
  const folderPath = await window.electronAPI.openFolderDialog();
  if (folderPath) {
    await loadAndSetMedia(folderPath);
  }
});

async function loadAndSetMedia(folderPath) {
  try {
    const mediaPaths = await window.electronAPI.loadMedia(folderPath);
    shuffleArray(mediaPaths);
    controller.setMedia(mediaPaths);
    currentFolder = folderPath;
    await window.electronAPI.setLastFolder(folderPath);
  } catch (err) {
    console.error('Load failed:', err);
  }
}

async function init() {
  const cliPath = await window.electronAPI.getCliArg();
  if (cliPath) {
    currentFolder = cliPath;
    await loadAndSetMedia(cliPath);
  } else {
    const lastFolder = await window.electronAPI.getLastFolder();
    if (lastFolder) {
      await loadAndSetMedia(lastFolder);
    }
  }
}

window.addEventListener('load', init);
