const fs = require('fs').promises
const path = require('path')
const { loadMediaPaths, shuffleArray } = require('./src/slideshowUtils.js')

const imageFolder = process.argv[process.argv.length - 1] // this is the additionalArguments
const slideShowElement = document.getElementById('slideshow-image')
const SlideshowController = require('./src/slideshowController.js')
const controller = new SlideshowController(slideShowElement, {
  interval: 3000,
  resumeDelayMs: 15000 
})

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        controller.next();
        controller.userInteracted();
    }
    else if (event.key === 'ArrowLeft') {
        controller.prev();
        controller.userInteracted();
    }
});

async function init() {
  try {
    const mediaPaths = await loadMediaPaths(imageFolder, fs, path)
    console.log('mediaPaths: ', mediaPaths)
    shuffleArray(mediaPaths)
    controller.setMedia(mediaPaths)
    controller.start()
  } catch (err) {
    console.error('Failed to load media: ', err)
    slideShowElement.alt = 'Error loading media'
  }
}

window.addEventListener('load', init)
