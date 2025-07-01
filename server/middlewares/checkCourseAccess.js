// // middleware/checkCourseAccess.js
// import { pool } from '../config/db.js';

// export const checkCourseAccess = async (req, res, next) => {
//   const user = req.user || req.instructor || req.admin;

//   if (!user) {
//     return res.status(401).json({ message: 'ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້ໃນລະບົບ' });
//   }

//   const userId = user.id || user.admin_id;
//   const courseId = req.params.courseId || req.params.id;

//   console.log('🔐 ກວດສອບສິດທິໃນການເຂົ້າເຖິງຄອສ:');
//   console.log('👉 userId:', userId);
//   console.log('👉 courseId:', courseId);

//   try {
//     // Admin ເຂົ້າໄດ້ທຸກຄອສ
//     if (user.admin_id) {
//       console.log('✅ Admin - ຜ່ານ');
//       return next();
//     }

//     // Instructor ເປັນເຈົ້າຂອງຄອສ
//     const ownerCheck = await pool.query(
//       'SELECT * FROM course WHERE id = $1 AND instructor_id = $2',
//       [courseId, userId]
//     );
//     if (ownerCheck.rows.length > 0) {
//       console.log('✅ Instructor ເປັນເຈົ້າຂອງຄອສ - ຜ່ານ');
//       return next();
//     }

//     // Learner ຕ້ອງລົງທະບຽນຄອສ
//     const enrollCheck = await pool.query(
//       'SELECT * FROM enroll WHERE user_id = $1 AND course_id = $2',
//       [userId, courseId]
//     );
//     if (enrollCheck.rows.length > 0) {
//       console.log('✅ Learner ລົງທະບຽນແລ້ວ - ຜ່ານ');
//       return next();
//     }

//     console.log('❌ ຜູ້ໃຊ້ບໍ່ມີສິດເຂົ້າຄອສ');
//     return res.status(403).json({ message: 'ທ່ານຍັງບໍ່ໄດ້ຊື້ຄອສນີ້' });

//   } catch (err) {
//     console.error('❗ ເກີດຂໍ້ຜິດພາດໃນການກວດສອບສິດເຂົ້າຄອສ:', err);
//     return res.status(500).json({ message: 'ເກີດຂໍ້ຜິດພາດໃນການກວດສອບສິດການເຂົ້າຄອສ' });
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

