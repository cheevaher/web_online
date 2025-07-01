// 


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

import { pool } from '../config/db.js'; // ✅ สำคัญ: ลืม import pool!

const router = express.Router();

// ✅ ดึงบทเรียนตัวอย่าง (ไม่ต้อง auth)
router.get('/courses/:courseId/lessons/preview', async (req, res) => {
  const { courseId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM lesson WHERE id = $1 ORDER BY lesson_id ASC LIMIT 1'
,
      [courseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบบทเรียนตัวอย่าง' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Preview lesson error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการโหลดบทเรียนตัวอย่าง' });
  }
});

// ✅ สร้างบทเรียน
router.post('/courses/:courseId/lessons', authenticate, createLesson);

// ✅ ดึงบทเรียนทั้งหมด (ใช้สิทธิ์)
router.get('/courses/:courseId/lessons', authenticate, checkCourseAccess, getLessonsByCourseId);

// ✅ ดึงบทเรียนเดี่ยว
router.get('/lessons/:lessonId', authenticate, getLessonById);

// ✅ แก้ไขบทเรียน
router.put('/lessons/:lessonId', authenticate, updateLesson);

// ✅ ลบบทเรียน
router.delete('/courses/:courseId/lessons/:lessonId', authenticate, deleteLesson);

export default router;