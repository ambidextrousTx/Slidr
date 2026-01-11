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
    this.modeText = document.getElementById('mode-text');
    this.countText = document.getElementById('media-count');
    console.log(`resumeDelayMs set to ${this.resumeDelayMs}`)
  }

  updateStatusDisplay() {
    if (!this.modeText || !this.countText) return;

    // Mode
    if (this.isAutoplaying) {
      this.modeText.textContent = 'Auto';
      this.modeText.parentElement.classList.remove('paused');
    } else {
      this.modeText.textContent = 'Manual';
      this.modeText.parentElement.classList.add('paused');
    }

    // Count (1-based index)
    const current = this.images.length > 0 ? this.currentIndex + 1 : 0;
    const total = this.images.length;
    this.countText.textContent = `${current} / ${total}`;
  }

  setImages(images) {
    this.images = images;
    this.currentIndex = 0;
    if (images.length > 0) {
      this.imageElement.src = images[0];
    }
    this.updateStatusDisplay();
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
    this.updateStatusDisplay();
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
    this.updateStatusDisplay();
  }

  prev() {
    if (this.images.length === 0) return;
    // Wrap around
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.imageElement.src = this.images[this.currentIndex];
    this.updateStatusDisplay();
  }

  pause() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    this.isAutoplaying = false;
    this.updateStatusDisplay();
  }
}

module.exports = SlideshowController
