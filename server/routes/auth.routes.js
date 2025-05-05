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
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }

    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'อีเมลนี้ถูกใช้แล้ว'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username.trim(), email.toLowerCase().trim(), hashedPassword]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'ลงทะเบียนสำเร็จ',
      user: newUser
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ LOGIN ROUTE พร้อมแนบ role เข้า JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'ต้องกรอกอีเมลและรหัสผ่าน' 
      });
    }

    // 1️⃣ เช็คใน users ก่อน
    let userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1', 
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

    // ❌ ถ้าไม่เจอทั้งสอง
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    // 3️⃣ เช็ครหัสผ่าน
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    // 4️⃣ เตรียมข้อมูล
    const userId = user.id || user.instructor_id;
    const userEmail = user.email || user.instructor_email;
    const userName = user.username || user.instructor_name;

    // ✅ สร้าง token ที่มี role
    const token = jwt.sign(
      { id: userId, email: userEmail, role: userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'ล็อกอินสำเร็จ',
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
      message: 'เกิดข้อผิดพลาดในการล็อกอิน',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
