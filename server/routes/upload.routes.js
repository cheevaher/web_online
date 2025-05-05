import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // โหลดค่า ENV

const router = express.Router();

// ตั้งค่า Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ใช้ CloudinaryStorage แทน diskStorage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads', // โฟลเดอร์ใน Cloudinary (สร้างอัตโนมัติถ้ายังไม่มี)
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

// เส้นทางสำหรับอัปโหลดรูปภาพ
router.post('/', upload.single('file'), (req, res) => {
  console.log(req.file)
  res.json({
    imageUrl: req.file.path,       // URL ที่ได้จาก Cloudinary
    publicId: req.file.filename    // ชื่อไฟล์ (ใช้สำหรับลบภายหลังได้)
  });
});

export default router;
