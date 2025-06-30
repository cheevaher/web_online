import express from 'express';
import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

/**
 * @route POST /api/instructors/register-instructor
 * @desc ลงทะเบียนผู้สอนใหม่
 * @access Public
 */
router.post('/register-instructor', async (req, res) => {
  try {
    const {
      instructor_name,
      instructor_tel,
      instructor_email,
      instructor_history, // ✅ ยังใช้ comment ได้ตรงนี้ (นอก SQL)
      address,
      password
    } = req.body;

    // 1. ตรวจสอบข้อมูลที่จำเป็น
    if (!instructor_name || !instructor_email || !password) {
      return res.status(400).json({
        success: false,
        message: 'ກະລຸນາໃສ່ຊື່, ອີເມວ ແລະ ລະຫັດຜ່ານ'
      });
    }

    // 2. ตรวจสอบอีเมลซ้ำ
    const emailCheck = await pool.query(
      'SELECT * FROM instructors WHERE instructor_email = $1',
      [instructor_email]
    );
    
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'ອີເມວນີ້ຖືກໃຊ້ໄປແລ້ວ'
      });
    }

    // 3. เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ แก้ไขตรงนี้: ลบ comment ที่อยู่ใน SQL query ออก
    const result = await pool.query(
      `INSERT INTO instructors (
        instructor_name, 
        instructor_tel, 
        instructor_email, 
        instructor_history, 
        address, 
        password
      ) VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, instructor_name, instructor_email`,
      [
        instructor_name,
        instructor_tel,
        instructor_email,
        instructor_history,
        address,
        hashedPassword
      ]
    );

    // 5. ส่งคำตอบกลับ
    const newInstructor = result.rows[0];
    res.status(201).json({
      success: true,
      message: 'ລົງທະບຽນຜູ້ສອນສຳເລັດ',
      data: newInstructor
    });

  } catch (error) {
    console.error('Error registering instructor:', error);
    res.status(500).json({
      success: false,
      message: 'ເກີດຄວາມຜິດພາດໃນການລົງທະບຽນຜູ້ສອນ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export const instructorRoutes = router;
