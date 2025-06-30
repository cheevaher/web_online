import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { checkCourseAccess } from '../middlewares/checkCourseAccess.js';
import {
  createLesson,
  getLessonsByCourseId,
  getLessonById,
  updateLesson,
  deleteLesson
} from '../controllers/lesson.controller.js';

const router = express.Router();

// เปลี่ยนจาก :id เป็น :courseId เพื่อความชัดเจน
router.post('/courses/:courseId/lessons', authenticate, createLesson);

// ดึงบทเรียนทั้งหมดของคอร์ส
router.get('/courses/:courseId/lessons', authenticate, checkCourseAccess, getLessonsByCourseId);

// ดึงบทเรียนเดี่ยว ๆ ตาม lesson ID
router.get('/lessons/:lessonId', authenticate, getLessonById);

// แก้ไขบทเรียน
router.put('/lessons/:lessonId', authenticate, updateLesson);


// ลบบทเรียนโดยระบุ courseId และ lessonId
router.delete('/courses/:courseId/lessons/:lessonId', authenticate, deleteLesson);


export default router;
