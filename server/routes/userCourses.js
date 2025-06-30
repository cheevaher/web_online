import express from 'express';
import { pool } from '../config/db.js';  // ปรับ path ให้ตรงกับไฟล์จริงของคุณ
import { authenticate } from '../middlewares/authenticate.js'; // หรือ auth.middleware.js ตามที่ใช้จริง

const router = express.Router();

// POST: บันทึกการซื้อคอร์ส
router.post('/', authenticate, async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  try {
    await pool.query(
      'INSERT INTO Enroll (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, courseId]
    );
    res.status(200).json({ message: 'ບັກທຶກການຊື້ສຳເລັດແລ້ວ' });
  } catch (err) {
    console.error('Error saving purchase:', err);
    res.status(500).json({ message: 'ບໍ່ສາມາດບັນທຶກການຊື້ໄດ້' });
  }
});

// GET: ตรวจสอบว่าผู้ใช้เคยซื้อคอร์สนี้หรือยัง
router.get('/:courseId', authenticate, async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM Enroll WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );
    res.json({ purchased: result.rows.length > 0 });
  } catch (err) {
    console.error('Error checking purchase:', err);
    res.status(500).json({ message: 'ເກີດຄວາມຜິດພາດໃນການກວດສອບ' });
  }
});

export default router;
