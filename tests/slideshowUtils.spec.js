const { loadMediaPaths, shuffleArray } = require('../src/slideshowUtils.js')

describe('slideshowUtils', () => {

  it('shuffles an array in place without changing length or contents', async () => {
    let originalArray = [1, 2, 3, 4, 5]
    let copy = [...originalArray]
    shuffleArray(copy)

    expect(copy.length).toEqual(originalArray.length)
    expect(copy.sort()).toEqual(originalArray.sort())
  })

  it('loads and filters image paths from a folder', async () => {

    const mockFs = {
      readdir: jest.fn().mockResolvedValue([
        'photo1.jpg',
        'photo2.png',
        'document.pdf',
        'image.gif',
        'photo3.JPEG',
        'notes.txt'
      ]),
      isDirectory: jest.fn().mockResolvedValue(false)
    };

    const mockPath = {
      join: jest.fn((folder, file) => `${folder}/${file}`)
    };
    
    const result = await loadMediaPaths('/fake/folder', mockFs, mockPath)
    expect(result).toHaveLength(4); // jpg, png, gif, JPEG
    expect(result).toEqual([
      '/fake/folder/photo1.jpg',
      '/fake/folder/photo2.png',
      '/fake/folder/image.gif',
      '/fake/folder/photo3.JPEG'
    ]);
    expect(mockFs.readdir).toHaveBeenCalledWith('/fake/folder')
  })
})

