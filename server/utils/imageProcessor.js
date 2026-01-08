import sharp from 'sharp';
import fs from 'fs';

// Kép átméretezés
const resizeImage = async (inputPath, outputPath, width = 500, height = 500) => {
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
};

// Kép törlés
const deleteImage = filePath => {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

export { resizeImage, deleteImage };
