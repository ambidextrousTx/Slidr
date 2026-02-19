import fs from 'node:fs/promises';
import path from 'node:path';

export const mediaExtensions = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.avif', '.webp', '.mp4', '.webm'
]);

export async function scanMediaDirectory(folderPath) {
  const result = [];

  /**
   * Recursive helper function
   * @param {string} currentDir
   */
  async function scanDir(currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      console.log("entries are " + entries);

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          // Recurse into subdirectory
          await scanDir(fullPath);
        }
        else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (mediaExtensions.has(ext)) {
            result.push(fullPath);
          }
        }
      }
    } catch (err) {
      console.warn(`Could not read directory ${currentDir}:`, err.message);
    }
  }

  console.log("Scanning " + folderPath);
  await scanDir(folderPath);
  console.log(`Loaded ${result.length} media files from ${folderPath}`);
  return result;
}

