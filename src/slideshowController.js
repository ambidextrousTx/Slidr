class SlideshowController {
  constructor(imageElement, options = {}) {
    this.imageElement = imageElement;
    this.interval = options.interval || 3000;
    this.images = [];
    this.currentIndex = 0;
    this.timerId = null;
  }

  setImages(images) {
    this.images = images;
    this.currentIndex = 0;
    if (images.length > 0) {
      this.imageElement.src = images[0];
    }
  }

  start() {
    if (this.timerId || this.images.length === 0) return;
    this.timerId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.imageElement.src = this.images[this.currentIndex];
    }, this.interval);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  next() {
    if (this.images.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.imageElement.src = this.images[this.currentIndex];
  }
}

module.exports = SlideshowController
