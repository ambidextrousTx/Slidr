const fs = require('fs').promises
const path = require('path')

const imageFolder = process.argv[process.argv.length - 1] // this is the additionalArguments
const slideshowImage = document.getElementById('slideshow-image')
let images = []
let currentIdx = 0;
const slideInterval = 3000;

async function loadImages() {
  try {
    const files = await fs.readdir(imageFolder)
    images = files
            .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
            .map(file => path.join(imageFolder, file))

    shuffleArray(images)
    if (images.length > 0) {
      slideshowImage.src = images[0]
      startSlidshow()
    } else {
      console.log('No images read in the folder: ', err)
    }
  } catch (err) {
    console.log('Error reading image folder: ', err)
  }
}

function shuffleArray(array) {
  console.log(array)
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    // [array[i], array[j]] = [array[j], array[i]]
  }
}

function startSlidshow() {
  setInterval(() => {
    currentIdx = (currentIdx + 1) % images.length
    slideshowImage.src = images[currentIdx]
  }, slideInterval)
}

window.onload = loadImages
