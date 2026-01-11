class SlideshowController {
  constructor(imageElement, options = {}) {
    this.imageElement = imageElement;
    this.interval = options.interval || 3000;
    this.images = [];
    this.currentIndex = 0;
    this.timerId = null;
    this.isAutoplaying = false;
    this.resumeTimeoutId = null;
    this.resumeDelayMs = options.resumeDelay || 15000; // 15 seconds default
    this.modeIndicator = document.getElementById('mode-indicator');
    console.log(`resumeDelayMs set to ${this.resumeDelayMs}`)
  }

  updateModeIndicator() {
  if (!this.modeIndicator) return;

  if (this.isAutoplaying) {
    this.modeIndicator.textContent = 'Auto';
    this.modeIndicator.classList.remove('paused');
  } else {
    this.modeIndicator.textContent = 'Manual';
    this.modeIndicator.classList.add('paused');
  }
}

  setImages(images) {
    this.images = images;
    this.currentIndex = 0;
    if (images.length > 0) {
      this.imageElement.src = images[0];
    }
  }

  userInteracted() {
    console.log('userInteracted called')
    this.pause();

    if (this.resumeTimeoutId) {
      clearTimeout(this.resumeTimeoutId)
      this.resumeTimeoutId = null;
    }

    this.resumeTimeoutId = setTimeout(() => {
      this.start();
      this.resumeTimeoutId = null;
    }, this.resumeDelayMs);
  }

  start() {
    if (this.timerId || this.images.length === 0) return;
    this.isAutoplaying = true;
    this.updateModeIndicator();
    this.timerId = setInterval(() => {
      this.next();
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

  prev() {
    if (this.images.length === 0) return;
    // Wrap around
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.imageElement.src = this.images[this.currentIndex];
  }

  pause() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    this.isAutoplaying = false;
    this.updateModeIndicator();
  }
}

module.exports = SlideshowController
