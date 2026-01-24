/**
 * @jest-environment jsdom
 */

const SlideshowController = require("../src/slideshowController")

const BASE_URL = 'http://localhost'

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
    mockImage.classList.add = jest.fn();
    mockImage.classList.remove = jest.fn();

    mockVideo = document.createElement('video');
    mockVideo.id = 'slideshow-video';
    mockVideo.play = jest.fn().mockResolvedValue(undefined);
    mockVideo.pause = jest.fn();
    mockVideo.load = jest.fn();
    mockVideo.addEventListener = jest.fn();
    mockVideo.classList.add = jest.fn();
    mockVideo.classList.remove = jest.fn();

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
    controller = undefined;
    mockImage = undefined;
    mockVideo = undefined;
    mockModeIndicator = undefined;
    mockModeText = undefined;
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

    expect(mockImage.src).toBe(BASE_URL + '/test/a.jpg');
    expect(mockImage.classList.add).toHaveBeenCalledWith('active');
    expect(mockVideo.classList.add).not.toHaveBeenCalled();
  });

  it('setMedia loads first item as image and updates display', () => {
    controller.setMedia(['/img/a.jpg', '/vid/b.mp4']);
    jest.advanceTimersByTime(100);

    expect(mockImage.src).toBe(BASE_URL + '/img/a.jpg');
    expect(mockImage.classList.add).toHaveBeenCalledWith('active');
  });

});
