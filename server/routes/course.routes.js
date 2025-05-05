import express from 'express';
import {
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse // ฟังก์ชันที่ต้องเขียนขึ้นสำหรับอัปเดตคอร์ส
} from '../controllers/course.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { deleteCourse } from '../controllers/course.controller.js';

const router = express.Router();

// สร้างคอร์สใหม่
router.post('/', createCourse);

// ดึงคอร์สที่ผู้สอนสร้าง
router.get('/mine', authenticate, getMyCourses);

// ดึงคอร์สตาม ID
router.get('/:id', getCourseById);

// อัปเดตคอร์สตาม ID
router.put('/:id', authenticate, updateCourse);  // นี่คือการปรับให้ตรงกับ path

router.delete('/:id', authenticate, deleteCourse);

export default router;
