/**
 * Loads image file paths from a folder
 * @param {string} folderPath
 * @param {Object} fs - File system module
 * @param {Object} path - Path module
 * @returns {Promise<string[]>} Array of image paths
 */
async function loadImagePaths(folderPath, fs, path) {
  const imageExtensions = new Set([
    '.jpg', '.jpeg', '.png', '.gif', '.avif', '.webp',
  ]);

  const result = [];

  /**
   * Recursive helper function
   * @param {string} currentDir
   */
  async function scanDir(currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          // Recurse into subdirectory
          await scanDir(fullPath);
        }
        else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (imageExtensions.has(ext)) {
            result.push(fullPath);
          }
        }
      }
    } catch (err) {
      console.warn(`Could not read directory ${currentDir}:`, err.message);
    }
  }

  await scanDir(folderPath);
  return result;
}

/**
 * Fisher-Yates shuffle (in-place)
 * @param {Array} array
 */
function shuffleArray(array) {
  if (!Array.isArray(array)) return;
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

module.exports = {
  loadImagePaths,
  shuffleArray
}
