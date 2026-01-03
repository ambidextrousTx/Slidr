const { loadImagePaths, shuffleArray } = require('../src/slideshowUtils.js')

describe('slideshowUtils', () => {
  it('shuffles an array in place without changing length or contents', async () => {
    let originalArray = [1, 2, 3, 4, 5]
    let copy = [...originalArray]
    shuffleArray(copy)

    expect(copy.length).toEqual(originalArray.length)
    expect(copy.sort()).toEqual(originalArray.sort())
  })
  
})
