import express from 'express';
import upload from '../middleware/upload.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';
const r = express.Router();
r.post('/', requireAuth, upload.array('photos',5), (req,res)=>{
  const urls = req.files.map(f=>f.path || f.secure_url || f.url);
  res.json({ urls });
});
export default r;
