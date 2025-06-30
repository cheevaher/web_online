import express from 'express';
import { pool } from '../config/db.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

// POST /api/purchase - บันทึกข้อมูลการซื้อคอร์ส พร้อมบันทึกราคา
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || req.instructor?.id;
    if (!userId) {
      return res.status(401).json({ message: 'ບໍ່ໄດ້ຮັບສິດໃນການເຂົ້າເຖິງ' });
    }

    const { courseId, price } = req.body;

    // ตรวจสอบว่าซื้อ/บันทึกคอร์สนี้ไปแล้วหรือยัง
    const check = await pool.query(
      'SELECT * FROM Enroll WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({ message: 'ທ່ານຊື້ຄອສນີ້ໄປແລ້ວ' });
    }

    // บันทึกข้อมูลการซื้อ/บันทึกคอร์สฟรี (price เป็น 0 หรือ 0.00 ก็ได้)
    await pool.query(
      'INSERT INTO Enroll (user_id, course_id, price) VALUES ($1, $2, $3)',
      [userId, courseId, price]
    );

    res.status(201).json({ message: 'ບັນທຶກການຊື້/ບັນທຶກຄອສສຳເລັດ' });
  } catch (err) {
    console.error('เกิดข้อผิดพลาดใน /purchase:', err);
    res.status(500).json({ message: 'ເກີດຄວາມຜິດພາດໃນການບັນທຶກກາານຊື້' });
  }
});


// GET /api/purchase/check/:courseId - ตรวจสอบว่าซื้อคอร์สแล้วหรือไม่
router.get('/check/:courseId', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || req.instructor?.id;

    if (!userId) {
      return res.status(401).json({ message: 'ບໍ່ໄດ້ຮັບສິດທິໃນການເຂົ້າເຖິງ' });
    }

    const { courseId } = req.params;

    const result = await pool.query(
      'SELECT * FROM Enroll WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );

    res.json({ hasPurchased: result.rows.length > 0 });
  } catch (err) {
    console.error('ເກີດຄວາມຜິດພາດໃນ /check/:courseId:', err);
    res.status(500).json({ message: 'ເກີດຄວາມຜິດພາດໃນການກວດສອບການຊື້' });
  }
});

// GET /api/purchase/my-courses - ดึงคอร์สที่ user ซื้อทั้งหมด พร้อมรายละเอียดคอร์ส
router.get('/my-courses', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || req.instructor?.id;

    if (!userId) {
      return res.status(401).json({ message: 'ບໍ່ຮັບສິດໃນການເຂົ້າເຖິງ' });
    }

    // ดึงข้อมูลคอร์สที่ซื้อ โดย join กับตาราง courses เพื่อดึงรายละเอียดคอร์ส
    const result = await pool.query(`
      SELECT c.*
      FROM Enroll uc
      JOIN course c ON uc.course_id = c.id
      WHERE uc.user_id = $1
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error('ເກີດຄວາມຜິດພາດໃນ /my-courses:', err);
    res.status(500).json({ message: 'ເກີດຄວາມຜິດພາດໃນການໂຫຼດຄອສຂອງທ່ານ' });
  }
});

export default router;
