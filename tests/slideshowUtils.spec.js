import { shuffleArray } from '../src/slideshowUtils.js';
import { jest } from '@jest/globals';

describe('slideshowUtils', () => {

  it('shuffles an array in place without changing length or contents', async () => {
    let originalArray = [1, 2, 3, 4, 5]
    let copy = [...originalArray]
    shuffleArray(copy)

    expect(copy.length).toEqual(originalArray.length)
    expect(copy.sort()).toEqual(originalArray.sort())
  })

  it('loads and filters media paths from a folder', async () => {

    // Mock fs.promises
    // Must use unstable_mockModule for ESM
    jest.unstable_mockModule('node:fs/promises', async () => {

      const mockReaddir = jest.fn();

      mockReaddir.mockResolvedValueOnce([
        { name: 'photo1.jpg', isFile: () => true, isDirectory: () => false },
        { name: 'photo2.png', isFile: () => true, isDirectory: () => false },
        { name: 'document.pdf', isFile: () => true, isDirectory: () => false },
        { name: 'image.gif', isFile: () => true, isDirectory: () => false },
        { name: 'photo3.JPEG', isFile: () => true, isDirectory: () => false },
        { name: 'notes.txt', isFile: () => true, isDirectory: () => false },
        { name: 'sample.mp4', isFile: () => true, isDirectory: () => false },
      ]);

      return {
        default: {
          readdir: mockReaddir,
        }
      };
    });

    // Must import after the mocked fs
    const { scanMediaDirectory } = await import('../src/mediaLoader.js');

    const result = await scanMediaDirectory('/fake/folder')

    expect(result).toHaveLength(5); // jpg, png, gif, JPEG, mp4
    expect(result).toEqual([
      '/fake/folder/photo1.jpg',
      '/fake/folder/photo2.png',
      '/fake/folder/image.gif',
      '/fake/folder/photo3.JPEG',
      '/fake/folder/sample.mp4',
    ]);

    const fs = (await import('node:fs/promises')).default;
    expect(fs.readdir).toHaveBeenCalledTimes(1);
  })

})

