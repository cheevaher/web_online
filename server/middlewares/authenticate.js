import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'ไม่พบ Token การเข้าถึง' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ลองหาจากตาราง users ก่อน
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    const instructorResult = await pool.query('SELECT * FROM instructors WHERE id = $1', [decoded.id]);

    if (userResult.rows.length > 0) {
      req.user = userResult.rows[0]; // ถ้าเป็น user ปกติ
    }

    if (instructorResult.rows.length > 0) {
      req.instructor = instructorResult.rows[0]; // ถ้าเป็น instructor
    }

    // ถ้าไม่เจอทั้งสอง
    if (!req.user && !req.instructor) {
      return res.status(403).json({ message: 'ไม่พบผู้ใช้หรือตัวตนในระบบ' });
    }

    next();
  } catch (error) {
    console.error('ข้อผิดพลาดในการตรวจสอบสิทธิ์:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token หมดอายุ' });
    }
    res.status(403).json({ message: 'Token ไม่ถูกต้อง' });
  }
};
