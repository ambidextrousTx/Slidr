/**
 * @jest-environment jsdom
 */

const SlideshowController = require("../src/slideshowController")

describe('SlideshowController (jsdom)', () => {
  let controller;
  let mockModeIndicator, mockModeText, mockCountText, mockImage, mockVideo;

  beforeEach(() => {
    jest.useFakeTimers();

    mockModeIndicator = document.createElement('div');
    mockModeIndicator.id = 'mode-indicator';
    mockModeIndicator.classList.add('mode-indicator');

    mockModeText = document.createElement('span');
    mockModeText.id = 'mode-text';
    mockModeText.textContent = 'Auto';

    mockCountText = document.createElement('span');
    mockCountText.id = 'media-count';
    mockCountText.textContent = '1 / 1';

    mockModeIndicator.appendChild(mockModeText);
    mockModeIndicator.appendChild(mockCountText);

    mockImage = document.createElement('img');
    mockImage.id = 'slideshow-image';
    mockImage.src = '';
    mockImage.add = jest.fn();
    mockImage.remove = jest.fn();

    mockVideo = document.createElement('video');
    mockVideo.id = 'slideshow-video';
    mockVideo.play = jest.fn().mockResolvedValue(undefined);
    mockVideo.pause = jest.fn();
    mockVideo.load = jest.fn();
    mockVideo.addEventListener = jest.fn();

    controller = new SlideshowController(
      { interval: 3000, resumeDelay: 15000 },
      {
        imageElement: mockImage,
        videoElement: mockVideo,
        modeText: mockModeText,
        countText: mockCountText,
        modeIndicator: mockModeIndicator
      }
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('initializes with correct elements', () => {
    expect(controller.imageElement).toBe(mockImage);
    expect(controller.videoElement).toBe(mockVideo);
  });

  it('shows image correctly', () => {
    controller.setMedia(['/test/a.jpg']);
    jest.advanceTimersByTime(100);
    expect(mockImage.src).toBe('/test/a.jpg');
    expect(mockImage.classList.add).toHaveBeenCalledWith('active');
    expect(mockVideo.classList.add).not.toHaveBeenCalled();
  });

  it('setMedia loads first item as image and updates display', () => {
    const mockImage = { src: '', classList: { add: jest.fn(), remove: jest.fn() } };
    const mockVideo = { 
      src: '', 
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn(),
      currentTime: 0,
      load: jest.fn(),
      classList: { add: jest.fn(), remove: jest.fn() },
      addEventListener: jest.fn()
    };

    const controller = new SlideshowController(
      { interval: 3000, resumeDelay: 15000 },
      {
        imageElement: mockImage,
        videoElement: mockVideo,
        modeText: { textContent: '' },
        countText: { textContent: '' },
        modeIndicator: { classList: { add: jest.fn(), remove: jest.fn() } }
      }
    );

    const media = ['/img/a.jpg', '/vid/b.mp4'];
    controller.setMedia(media);

    expect(mockImage.src).toBe('/img/a.jpg');
    expect(mockImage.classList.contains('active')).toBe(true);
    expect(mockVideo.src).toBe('/vid/b.mp4')
    expect(mockVideo.classList.contains('active')).toBe(false);
    expect(mockModeText.textContent).toBe('Auto');
    expect(mockCountText.textContent).toBe('1 / 2');
  });

});
