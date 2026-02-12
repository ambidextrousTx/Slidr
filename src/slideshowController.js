class SlideshowController {
  constructor(options = {}, deps = {}) {
    this.container = deps.container || document.getElementsByClassName('slideshow-container')[0];
    this.imageElement = deps.imageElement || document.getElementById('slideshow-image');
    this.videoElement = deps.videoElement || document.getElementById('slideshow-video');
    this.modeIndicator = deps.modeIndicator || document.getElementById('mode-indicator');
    this.modeText = deps.modeText || document.getElementById('mode-text');
    this.countText = deps.countText || document.getElementById('media-count');
    this.currentMediaType = '';
    this.currentSrc = ''; 
    this.interval = options.interval || 3000;
    this.media = [];
    this.currentIndex = 0;
    this.timerId = null;
    this.isAutoplaying = false;
    this.resumeTimeoutId = null;
    this.resumeDelayMs = options.resumeDelay || 15000; // 15 seconds default

    this.videoElement.addEventListener('ended', () => {
      if (this.isAutoplaying) {
        this.next();
      }
    });
  }

  showMedia(path) {
    if (!path) return;

    const ext = path.split('.').pop().toLowerCase();
    const isVideo = ['mp4', 'webm'].includes(ext);

    // Fade out current active
    if (this.currentMediaType === 'image') {
      this.imageElement.classList.remove('active');
    } else if (this.currentMediaType === 'video') {
      this.videoElement.pause();           // important!
      this.videoElement.currentTime = 0;   // reset for next time
      this.videoElement.classList.remove('active');
    }

    // Don't want video advancing after 3s, so pause here
    // and conditionally restart for images
    this.pause();

    // Small delay to let fade-out start (makes it smoother)
    setTimeout(() => {
      if (isVideo) {
        this.videoElement.src = path;
        this.videoElement.load();          // sometimes needed
        this.videoElement.play().catch(e => console.warn('Video play failed:', e));
        this.videoElement.classList.add('active');
        this.currentMediaType = 'video';
      } else {
        this.imageElement.src = path;
        this.imageElement.classList.add('active');
        this.currentMediaType = 'image';
        if (this.isAutoplaying) {
          this.start();
        }
      }

      this.currentSrc = path;
      this.updateStatusDisplay();
    }, 50);   // tiny delay — adjust or remove
  }

  updateStatusDisplay() {
    if (!this.modeText || !this.countText || !this.modeIndicator) return;

    // Early exit
    if (this.media.length == 0) {
      this.modeText.textContent = 'No Media';
      this.countText.textContent = '';
      this.modeIndicator.classList.remove('paused');
      return;
    }

    // Mode
    if (this.isAutoplaying) {
      this.modeText.textContent = 'Auto';
      this.modeText.parentElement.classList.remove('paused');
    } else {
      this.modeText.textContent = 'Manual';
      this.modeText.parentElement.classList.add('paused');
    }

    // Count (1-based index)
    const current = this.media.length > 0 ? this.currentIndex + 1 : 0;
    const total = this.media.length;
    this.countText.textContent = `${current} / ${total}`;
  }

  setMedia(mediaPaths) {
    this.media = mediaPaths;
    this.currentIndex = 0;
    if (mediaPaths.length > 0) {
      this.container.classList.remove('empty');
      this.showMedia(mediaPaths[0]);
      this.start();
    } else {
      if (this.imageElement) this.imageElement.classList.remove('active');
      if (this.videoElement) this.videoElement.classList.remove('active');
      this.videoElement.pause();
      this.container.classList.add('empty');
    }
    this.updateStatusDisplay();
  }

  userInteracted() {
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
    if (this.timerId || this.media.length === 0) return;
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
    if (this.media.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.media.length;
    this.showMedia(this.media[this.currentIndex]);
    this.updateStatusDisplay();
  }

  prev() {
    if (this.media.length === 0) return;
    // Wrap around
    this.currentIndex = (this.currentIndex - 1 + this.media.length) % this.media.length;
    this.showMedia(this.media[this.currentIndex]);
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
