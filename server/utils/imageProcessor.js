import sharp from 'sharp';
import fs from 'fs';

const imageProcessor = {
  // Kép átméretezés + optimalizálás
  async resize(inputPath, outputPath, width = 500, height = 500) {
    try {
      await sharp(inputPath)
        .resize(width, height, { fit: 'cover' })
        .toFormat('webp')
        .webp({ quality: 80 })
        .toFile(outputPath);

      return outputPath;
    } catch (err) {
      console.error('Error resizing image:', err);
      throw err;
    }
  },

  // Kép törlés
  remove(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      throw err;
    }
  },
};

export default imageProcessor;
