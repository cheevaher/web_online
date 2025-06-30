// File: routes/comment.routes.js
import express from 'express';
import { pool } from '../config/db.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

// GET /api/comments/:courseId/:lessonId - ดึงคอมเมนต์ของบทเรียน
router.get('/:courseId/:lessonId', authenticate, async (req, res) => {
  const { courseId, lessonId } = req.params;

  try {
    const result = await pool.query(
  `SELECT c.*, 
      COALESCE(u.username, i.instructor_name) AS username
   FROM comments c
   LEFT JOIN learner u ON u.id = c.user_id
   LEFT JOIN instructors i ON i.id = c.instructor_id
   WHERE c.course_id = $1 AND c.lesson_id = $2
   ORDER BY c.created_at ASC`,
  [courseId, lessonId]
);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'ດຶງຄວາມຄິດເຫັນບໍ່ໄດ້' });
  }
});


// POST /api/comments - เพิ่มคอมเมนต์ใหม่
router.post('/', authenticate, async (req, res) => {
  const user_id = req.user ? req.user.id : null;
  const instructor_id = req.instructor ? req.instructor.id : null;

  if (!user_id && !instructor_id) {
    return res.status(403).json({ message: 'ບໍ່ມີສິດໃນການໃຊ້ງານ' });
  }

  // บันทึก comment โดยใส่ user_id หรือ instructor_id ลงใน DB
  const { course_id, lesson_id, content } = req.body;

  // สมมติใช้ user_id ถ้ามี ไม่งั้นใช้ instructor_id
  const authorId = user_id || instructor_id;

  // ตัวอย่าง insert
  const result = await pool.query(
    `INSERT INTO comments (course_id, lesson_id, user_id, instructor_id, content) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [course_id, lesson_id, user_id, instructor_id, content]
  );

  res.json(result.rows[0]);
});


export default router;
