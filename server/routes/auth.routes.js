// auth.routes.js
import express from 'express';
import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ✅ REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'ກະລຸນາໃສ່ຂໍ້ມູນໃຫ້ຄົບຖ້ວນ'
      });
    }

    const existingUser = await pool.query(
      'SELECT * FROM learner WHERE email = $1',
      [email.toLowerCase().trim()]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'ອີເມວນີ້ຖືກໃຊ້ໄປແລ້ວ'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO learner (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username.trim(), email.toLowerCase().trim(), hashedPassword]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'ລົງທະບຽນສຳເລັດ',
      user: newUser
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'ເກີດຄວາມຜິດພາດໃນການລົງທະບຽນ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ LOGIN ROUTE พร้อมแนบ role เข้า JWT
// ✅ LOGIN ROUTE พร้อมแนบ role เข้า JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'ຕ້ອງໃສ່ອີເມວ ແລະ ລະຫັດຜ່ານ' 
      });
    }

    // 1️⃣ เช็คใน users ก่อน
    let userResult = await pool.query(
      'SELECT * FROM learner WHERE email = $1', 
      [email.toLowerCase().trim()]
    );

    let userType = 'user';
    let user = null;

    // 2️⃣ ถ้าไม่เจอใน users ให้ไปเช็คใน instructors
    if (userResult.rows.length === 0) {
      userResult = await pool.query(
        'SELECT * FROM instructors WHERE instructor_email = $1', 
        [email.toLowerCase().trim()]
      );
      if (userResult.rows.length > 0) {
        userType = 'instructor';
        user = userResult.rows[0];
      }
    } else {
      user = userResult.rows[0];
    }

    // 3️⃣ ถ้าไม่เจอใน instructors ให้ไปเช็ค admin
    if (!user) {
      userResult = await pool.query(
        'SELECT * FROM admin WHERE admin_email = $1',
        [email.toLowerCase().trim()]
      );
      if (userResult.rows.length > 0) {
        userType = 'admin';
        user = userResult.rows[0];
      }
    }

    // ❌ ถ้าไม่เจอทั้งสามที่
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'ອີເມວ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ' 
      });
    }
if (userType === 'instructor' && !user.is_approved) {
  return res.status(403).json({
    success: false,
    message: 'ບັນຊີຜູ້ສອນຂອງທ່ານຍັງບໍ່ໄດ້ຮັບການອະນຸຍາດຈາກຜູ້ດູແລລະບົບ.'
  });
}
    // 4️⃣ เช็ครหัสผ่าน โดยใช้ field ต่างกันใน admin กับ user/instructor
    let passwordField = 'password'; // default user/instructor ใช้ password
    if (userType === 'admin') {
      passwordField = 'admin_pad'; // รหัสผ่านใน admin ใช้ admin_pad
    }

    const isMatch = await bcrypt.compare(password.trim(), user[passwordField]);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'ອີເມວ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ' 
      });
    }

    // 5️⃣ เตรียมข้อมูล
    const userId = user.id || user.instructor_id || user.admin_id;
    const userEmail = user.email || user.instructor_email || user.admin_email;
    const userName = user.username || user.instructor_name || 'Admin';

    // ✅ สร้าง token ที่มี role
    const token = jwt.sign(
      { id: userId, email: userEmail, role: userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'ເຂົ້າສູ່ລະບົບສຳເລັດ',
      token,
      user: {
        id: userId,
        name: userName,
        email: userEmail,
        role: userType
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'ເກີດຄວາມຜິດພາດໃນການເຂົ້າລະບົບ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


export default router;
