import { shuffleArray } from '../src/slideshowUtils.js';

describe('slideshowUtils', () => {

  it('shuffles an array in place without changing length or contents', async () => {
    let originalArray = [1, 2, 3, 4, 5]
    let copy = [...originalArray]
    shuffleArray(copy)

    expect(copy.length).toEqual(originalArray.length)
    expect(copy.sort()).toEqual(originalArray.sort())
  })

  it('loads and filters media paths from a folder', async () => {

    const mockFs = {
      readdir: jest.fn().mockResolvedValueOnce([
        { name: 'photo1.jpg', isFile: () => true, isDirectory: () => false },
        { name: 'photo2.png', isFile: () => true, isDirectory: () => false },
        { name: 'document.pdf', isFile: () => true, isDirectory: () => false },
        { name: 'image.gif', isFile: () => true, isDirectory: () => false },
        { name: 'photo3.JPEG', isFile: () => true, isDirectory: () => false },
        { name: 'notes.txt', isFile: () => true, isDirectory: () => false },
        { name: 'sample.mp4', isFile: () => true, isDirectory: () => false },
      ]),
    };

    const mockPath = {
      join: jest.fn((folder, file) => `${folder}/${file}`),
      extname: jest.fn((path) => path.substring(path.lastIndexOf('.'))),
    };
    
    const result = await loadMediaPaths('/fake/folder', mockFs, mockPath)
    expect(result).toHaveLength(5); // jpg, png, gif, JPEG, mp4
    expect(result).toEqual([
      '/fake/folder/photo1.jpg',
      '/fake/folder/photo2.png',
      '/fake/folder/image.gif',
      '/fake/folder/photo3.JPEG',
      '/fake/folder/sample.mp4',
    ]);
    expect(mockFs.readdir).toHaveBeenCalledWith('/fake/folder', {'withFileTypes': true})
  })
})

