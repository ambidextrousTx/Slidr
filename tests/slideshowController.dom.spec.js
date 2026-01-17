/**
 * @jest-environment jsdom
 */

const SlideshowController = require("../src/slideshowController")

describe('slideshowController', () => {
  it('picks the next image on next', () => {
    document.body.innerHTML = '<img id="slideshow" />';
    const img = document.getElementById('slideshow');
    const controller = new SlideshowController(img)
    controller.setImages(['img1.jpg', 'img2.jpg', 'img3.jpg'])
    controller.next()
    expect(img.src).toBe('img2.jpg')
  })
})
