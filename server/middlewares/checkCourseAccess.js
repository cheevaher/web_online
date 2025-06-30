// // import { pool } from '../config/db.js';

// export const checkCourseAccess = async (req, res, next) => {
//   const user = req.user || req.instructor || req.admin;

//   if (!user) {
//     return res.status(401).json({ message: 'ไม่พบข้อมูลผู้ใช้ในระบบ' });
//   }

//   const userId = user.id || user.admin_id; // admin_id สำหรับ admin
//   const courseId = req.params.courseId || req.params.id; // ตรวจสอบพารามิเตอร์

//   try {
//     // ตรวจสอบ admin
//     if (user.admin_id) {
//       return next();
//     }

//     // ตรวจสอบเจ้าของคอร์ส (instructor)
//     const ownerCheck = await pool.query(
//       'SELECT * FROM course WHERE id = $1 AND instructor_id = $2',
//       [courseId, userId]
//     );

//     if (ownerCheck.rows.length > 0) {
//       return next();
//     }

//     // ตรวจสอบการซื้อคอร์ส (learner)
//     const enrollCheck = await pool.query(
//       'SELECT * FROM enroll WHERE user_id = $1 AND course_id = $2',
//       [userId, courseId]
//     );

//     if (enrollCheck.rows.length === 0) {
//       return res.status(403).json({ message: 'คุณยังไม่ได้ซื้อคอร์สนี้' });
//     }

//     next();
//   } catch (err) {
//     console.error('Check Course Access Error:', err);
//     res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์การเข้าถึงคอร์ส' });
//   }
// };
import { pool } from '../config/db.js';

export const checkCourseAccess = async (req, res, next) => {
  console.log('🧪 DEBUG checkCourseAccess');
  console.log('req.user:', req.user);
  console.log('req.instructor:', req.instructor);
  console.log('req.admin:', req.admin);

  // รวมผู้ร้องขอไว้ตัวเดียว รองรับทุกบทบาท
const requester = req.user || req.instructor || req.admin;
console.log('➡️ requester:', requester);

if (!requester || !requester.id) {
  console.log('❌ requester ไม่มีข้อมูลหรือไม่มี id');
  return res.status(401).json({ message: 'ไม่พบข้อมูลผู้ใช้ในระบบหรือข้อมูลไม่ครบ' });
}

const userId = requester.id;
const courseId = req.params.courseId;
console.log(`🔍 userId = ${userId}, courseId = ${courseId}`);


  try {
    // ตรวจสอบว่า requester เป็น admin หรือไม่
    const adminCheck = await pool.query(
      'SELECT * FROM admin WHERE admin_id = $1',
      [userId]
    );
    if (adminCheck.rows.length > 0) {
      console.log('🎉 เป็น Admin -> ผ่านได้เลย');
      return next();
    }

    // ตรวจสอบว่าเป็นเจ้าของคอร์ส
    const ownerCheck = await pool.query(
      'SELECT * FROM course WHERE id = $1 AND instructor_id = $2',
      [courseId, userId]
    );
    if (ownerCheck.rows.length > 0) {
      console.log('🎉 เป็นเจ้าของคอร์ส -> ผ่านได้เลย');
      return next();
    }

    // ตรวจสอบว่าซื้อคอร์สแล้วหรือไม่
    const enrollCheck = await pool.query(
      'SELECT * FROM Enroll WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );
    if (enrollCheck.rows.length === 0) {
      console.log('❌ ยังไม่ได้ซื้อคอร์ส -> ปฏิเสธ');
      return res.status(403).json({ message: 'คุณยังไม่ได้ซื้อคอร์สนี้' });
    }

    console.log('✅ ซื้อคอร์สแล้ว -> ผ่าน');
    next();

  } catch (err) {
    console.error('❌ Check Course Access Error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์การเข้าถึงคอร์ส' });
  }
};

