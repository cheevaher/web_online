import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const authenticate = async (req, res, next) => {
  try {
    // ดึง token จาก header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'ไม่พบ Token การเข้าถึง' });
    }

    // ตรวจสอบ validity ของ token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ค้นหาผู้ใช้จากฐานข้อมูล
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    const instructorResult = await pool.query('SELECT * FROM instructors WHERE id = $1', [decoded.id]);

    // ถ้าพบผู้ใช้เป็น user ปกติ
    if (userResult.rows.length > 0) {
      req.user = userResult.rows[0];
    }

    // ถ้าพบผู้ใช้เป็น instructor
    if (instructorResult.rows.length > 0) {
      req.instructor = instructorResult.rows[0];
    }

    // ถ้าไม่พบผู้ใช้ในระบบทั้ง 2 แบบ
    if (!req.user && !req.instructor) {
      return res.status(403).json({ message: 'ไม่พบผู้ใช้หรือตัวตนในระบบ' });
    }

    // ถ้าผ่านการตรวจสอบสิทธิ์แล้วให้ไปที่ next()
    next();
  } catch (error) {
    console.error('ข้อผิดพลาดในการตรวจสอบสิทธิ์:', error);

    // ตรวจสอบว่า token หมดอายุหรือไม่
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token หมดอายุ กรุณาล็อกอินใหม่' });
    }

    // ถ้า token ไม่ถูกต้อง
    res.status(403).json({ message: 'Token ไม่ถูกต้อง' });
  }
};
