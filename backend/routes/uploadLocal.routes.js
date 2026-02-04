import express from 'express';
import upload from '../middleware/uploadLocal.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const r = express.Router();

// Upload single image untuk hotel
r.post('/hotel', requireAuth, (req, res, next) => {
  console.log('Upload request received');
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Ukuran file terlalu besar (maksimal 5MB)' });
      }
      if (err.message && err.message.includes('Hanya file gambar')) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: 'Upload gagal: ' + (err.message || 'Unknown error') });
    }
    next();
  });
}, (req, res) => {
  try {
    console.log('File received:', req.file);
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ message: 'Tidak ada file yang diupload. Pastikan field name adalah "image".' });
    }

    console.log('File saved:', req.file.filename);
    // Return filename saja (bukan full path)
    res.json({ 
      filename: req.file.filename,
      message: 'Upload berhasil'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload gagal', error: error.message });
  }
});

export default r;

