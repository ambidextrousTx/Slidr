/**
 * Loads image file paths from a folder
 * @param {string} folderPath
 * @param {Object} fs - File system module
 * @param {Object} path - Path module
 * @returns {Promise<string[]>} Array of image paths
 */
async function loadImagePaths(folderPath, fs, path) {
  const files = await fs.readdir(folderPath);
  return files
    .filter(file => /\.(jpe?g|png|gif)$/i.test(file))
    .map(file => path.join(folderPath, file));
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
