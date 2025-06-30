// ✅ ใช้เฉพาะ import
import express from 'express';
import {
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getAllCourses
} from '../controllers/course.controller.js';  // ตรวจสอบการ import ให้ถูกต้อง
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

// 🔧 Routes

// สร้างคอร์สใหม่
router.post('/', authenticate, createCourse);

// ดึงคอร์สที่ผู้สอนสร้าง
router.get('/mine', authenticate, getMyCourses);

// ดึงคอร์สทั้งหมด
router.get('/', getAllCourses);

// ดึงคอร์สตาม ID
router.get('/:id', getCourseById);

// อัปเดตคอร์สตาม ID
router.put('/:id', authenticate, updateCourse);

// ลบคอร์สตาม ID
router.delete('/:id', authenticate, deleteCourse);

// ✅ export router
export default router;
