import path from 'path';
import imageProcessor from "../utils/imageProcessor.js";

const uploadsDir = path.resolve('server/storage/uploads');
const processedDir = path.resolve('server/storage/processed');

// Győződjünk meg, hogy a feldolgozott mappa létezik
import fs from 'fs';
if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir, { recursive: true });

const uploadService = {
  processFile: async file => {
    if (!file) return null;

    const outputFile = path.join(processedDir, `${Date.now()}-${file.originalname}.webp`);
    await resizeImage(file.path, outputFile, 500, 500);
    return outputFile;
  },

  deleteFile: async filePath => {
    try {
      deleteImage(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  },
};

export default uploadService;
