// import jwt from 'jsonwebtoken';
// import { pool } from '../config/db.js';

// export const authenticate = async (req, res, next) => {
//   try {
//     // ดึง token จาก header
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       console.log('ไม่พบ Token ใน Header');
//       return res.status(401).json({ message: 'ไม่พบ Token การเข้าถึง' });
//     }

//     // ตรวจสอบ validity ของ token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded JWT:', decoded);

//     // ค้นหาผู้ใช้จากฐานข้อมูล
//     const userResult = await pool.query('SELECT * FROM learner WHERE id = $1', [decoded.id]);
//     console.log('User from DB:', userResult.rows);

//     const instructorResult = await pool.query('SELECT * FROM instructors WHERE id = $1', [decoded.id]);
//     console.log('Instructor from DB:', instructorResult.rows);

//     const adminResult = await pool.query('SELECT * FROM admin WHERE admin_id = $1', [decoded.id]);
//     console.log('Admin from DB:', adminResult.rows);

//     // ถ้าพบผู้ใช้เป็น user ปกติ
//     if (userResult.rows.length > 0) {
//       req.user = userResult.rows[0];
//     }

//     // ถ้าพบผู้ใช้เป็น instructor
//     if (instructorResult.rows.length > 0) {
//       req.instructor = instructorResult.rows[0];
//     }

//     // ถ้าพบผู้ใช้เป็น admin
//     if (adminResult.rows.length > 0) {
//       req.admin = adminResult.rows[0];
//     }

//     // ถ้าไม่พบผู้ใช้ในระบบทั้ง 3 แบบ
//     if (!req.user && !req.instructor && !req.admin) {
//       console.log('ไม่พบผู้ใช้หรือตัวตนในระบบ');
//       return res.status(403).json({ message: 'ไม่พบผู้ใช้หรือตัวตนในระบบ' });
//     }

//     // ถ้าผ่านการตรวจสอบสิทธิ์แล้วให้ไปที่ next()
//     next();
//   } catch (error) {
//     console.error('ข้อผิดพลาดในการตรวจสอบสิทธิ์:', error);

//     // ตรวจสอบว่า token หมดอายุหรือไม่
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: 'Token หมดอายุ กรุณาล็อกอินใหม่' });
//     }

//     // ถ้า token ไม่ถูกต้อง
//     res.status(403).json({ message: 'Token ไม่ถูกต้อง' });
//   }
// };
// import jwt from 'jsonwebtoken';
// import { pool } from '../config/db.js';

// export const authenticate = async (req, res, next) => {
//   try {
//     // ตรวจสอบว่า header มี Authorization และเป็น Bearer token
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       console.log('❌ ไม่พบหรือรูปแบบ Authorization Header ไม่ถูกต้อง');
//       return res.status(401).json({ message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน' });
//     }

//     // แยก token ออกจาก Bearer
//     const token = authHeader.split(' ')[1];

//     // ตรวจสอบความถูกต้องของ token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('✅ JWT ถูกต้อง:', decoded);

//     // ตรวจสอบผู้ใช้จากฐานข้อมูล
//     const userResult = await pool.query('SELECT * FROM learner WHERE id = $1', [decoded.id]);
//     if (userResult.rows.length > 0) {
//       req.user = userResult.rows[0];
//       console.log('👤 ผู้ใช้เป็น Learner:', req.user);
//       return next();
//     }

//     const instructorResult = await pool.query('SELECT * FROM instructors WHERE id = $1', [decoded.id]);
//     if (instructorResult.rows.length > 0) {
//       req.instructor = instructorResult.rows[0];
//       console.log('👨‍🏫 ผู้ใช้เป็น Instructor:', req.instructor);
//       return next();
//     }

//     const adminResult = await pool.query('SELECT * FROM admin WHERE admin_id = $1', [decoded.id]);
//     if (adminResult.rows.length > 0) {
//       req.admin = adminResult.rows[0];
//       console.log('👑 ผู้ใช้เป็น Admin:', req.admin);
//       return next();
//     }

//     console.log('❌ ไม่พบผู้ใช้งานในระบบ');
//     return res.status(403).json({ message: 'ไม่พบผู้ใช้ในระบบ' });

//   } catch (error) {
//     console.error('❗ ข้อผิดพลาดในการยืนยันตัวตน:', error);

//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: 'Token หมดอายุ กรุณาเข้าสู่ระบบใหม่' });
//     }

//     return res.status(403).json({ message: 'Token ไม่ถูกต้อง หรือเกิดข้อผิดพลาดในการยืนยันตัวตน' });
//   }
// };
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('ไม่พบ Token ใน Header');
      return res.status(401).json({ message: 'ไม่พบ Token การเข้าถึง' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded);

    // ตรวจสอบ admin ก่อน เพื่อป้องกันการ set req.user ผิด
    const adminResult = await pool.query('SELECT * FROM admin WHERE admin_id = $1', [decoded.id]);
    if (adminResult.rows.length > 0) {
  const admin = adminResult.rows[0];
  admin.id = admin.admin_id;  // <-- เพิ่มบรรทัดนี้
  req.admin = admin;
  return next();
}


    // ถ้าไม่ใช่ admin ค่อยตรวจสอบ instructor
    const instructorResult = await pool.query('SELECT * FROM instructors WHERE id = $1', [decoded.id]);
    if (instructorResult.rows.length > 0) {
      req.instructor = instructorResult.rows[0];
      return next();
    }

    // ตรวจสอบ learner (user ปกติ)
    const userResult = await pool.query('SELECT * FROM learner WHERE id = $1', [decoded.id]);
    if (userResult.rows.length > 0) {
      req.user = userResult.rows[0];
      return next();
    }

    console.log('ไม่พบผู้ใช้หรือตัวตนในระบบ');
    return res.status(403).json({ message: 'ไม่พบผู้ใช้หรือตัวตนในระบบ' });

  } catch (error) {
    console.error('ข้อผิดพลาดในการตรวจสอบสิทธิ์:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token หมดอายุ กรุณาล็อกอินใหม่' });
    }

    return res.status(403).json({ message: 'Token ไม่ถูกต้อง' });
  }
};