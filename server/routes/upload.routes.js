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
  params: (req, file) => {
    // ตรวจสอบว่าเป็นรูปภาพหรือวิดีโอ
    const isImage = file.mimetype.startsWith('image');
    const isVideo = file.mimetype.startsWith('video');

    // เลือก folder และ allowed_formats ตามประเภทไฟล์
    return {
      folder: isImage ? 'uploads/images' : isVideo ? 'uploads/videos' : 'uploads/other',
      allowed_formats: isImage
        ? ['jpg', 'jpeg', 'png']
        : isVideo
        ? ['mp4', 'mov', 'avi', 'mkv']
        : [], // สามารถกำหนดไฟล์ประเภทอื่นได้ถ้าต้องการ
      resource_type: isImage ? 'image' : isVideo ? 'video' : 'raw', // กำหนด resource type ตามประเภทไฟล์
    };
  },
});

const upload = multer({ storage });

// เส้นทางสำหรับอัปโหลดไฟล์ (ทั้งรูปภาพและวิดีโอ)
router.post('/', upload.single('file'), (req, res) => {
  console.log(req.file); // ดูข้อมูลไฟล์ที่อัพโหลด

  // ส่ง URL ของไฟล์ที่อัพโหลดไปกลับ
  res.json({
    fileUrl: req.file.path,  // URL ของไฟล์ที่อัพโหลด
    publicId: req.file.filename, // publicId ของไฟล์ (ใช้สำหรับลบภายหลังได้)
  });
});

export default router;
