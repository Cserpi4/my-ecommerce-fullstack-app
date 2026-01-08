import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Feltöltési mappa
const storageDir = path.resolve('server/storage/uploads');
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

// File szűrés: csak képek
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed!'), false);
};

// Multer middleware export
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // max 5MB

export default upload;
