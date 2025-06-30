import express from 'express';
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM admin WHERE admin_email = $1', [email]);
    const admin = result.rows[0];

    if (!admin) return res.status(401).json({ error: 'ບໍ່ພົບບັນຊີນີ້' });

    const valid = await bcrypt.compare(password, admin.admin_pad);
    if (!valid) return res.status(401).json({ error: 'ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ' });

    // สร้าง JWT Token
    const token = jwt.sign(
      { admin_id: admin.admin_id, email: admin.admin_email },
      'SECRET_KEY', // ควรเก็บใน .env    
      { expiresIn: '1h' }
    );

    res.json({ message: 'ເຂົ້າສູ່ລະບົບສຳເລັດ', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ເກີດຄວາມຜິດພາດຈາກເຊີເວີ' });
  }
});
// GET: ดึง instructors ทั้งหมด
router.get('/instructors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM instructors ORDER BY id DESC');
    res.json({ instructors: result.rows });
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ message: 'ເກີດຄວາມຜິດພາດໃນການເຂົ້າເຖິງຂໍ້ມູນຜູ້ສອນ' });
  }
});

// PATCH: อนุมัติผู้สอน
router.patch('/approve-instructor/:id', async (req, res) => {
  const instructorId = req.params.id;
  const { status } = req.body;

  try {
    await pool.query('UPDATE instructors SET is_approved = $1 WHERE id = $2', [status, instructorId]);
    res.json({ message: status ? 'ອານຸມັດຜູ້ສອນສຳເລັດ' : 'ຍົກເລີກການອານຸມັດຜູ້ສອນແລ້ວ' });
  } catch (error) {
    console.error('Error approving instructor:', error);
    res.status(500).json({ message: 'ບໍ່ສາມາດອານຸມັດໄດ້' });
  }
});
router.get('/instructor-report', async (req, res) => {
  try {
const query = `
  SELECT 
    i.id,
    i.instructor_name,
    i.instructor_email,
    i.instructor_tel,
    i.address,
    i.created_at,
    COUNT(DISTINCT c.id) AS total_courses,
    COALESCE(SUM(uc.price), 0) AS total_earnings
  FROM instructors i
  LEFT JOIN course c ON c.instructor_id = i.id
  LEFT JOIN Enroll uc ON uc.course_id = c.id
  GROUP BY i.id, i.instructor_name, i.instructor_email, i.instructor_tel, i.address, i.created_at
  ORDER BY i.created_at DESC;
`;


    const { rows } = await pool.query(query);

    // ใส่ตรงนี้
   ('instructor-report rows:', rows);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching instructor report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Route: GET /api/admin/instructor-courses/:instructorId
// Route: GET /api/admin/instructor-courses/:instructorId
router.get('/instructor-courses/:instructorId', async (req, res) => {
  const { instructorId } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.id, c.course_name, c.course_price, c.course_description, c.course_image, cat.name as category_name
FROM course c
LEFT JOIN categories cat ON c.category_id = cat.id
WHERE c.instructor_id = $1
`,
      [instructorId]
    );

    // ใส่ console.log ที่นี่เลย เพื่อดูข้อมูลที่จะส่งไปฝั่ง client
    ('Courses for instructor', instructorId, ':', result.rows);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching courses');
  }
});




export default router;


