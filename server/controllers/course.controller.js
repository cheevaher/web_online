// ฟังก์ชันช่วยดึง public_id จาก URL ของ Cloudinary
const getPublicIdFromUrl = (url) => {
  const regex = /\/upload\/(?:v\d+\/)?(.+)\.\w+$/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
import cloudinary from 'cloudinary';

import { pool } from '../config/db.js'; // ใช้ pool ที่เชื่อมต่อฐานข้อมูล PostgreSQL

// ฟังก์ชันสำหรับสร้างคอร์ส
export const createCourse = async (req, res) => {
  try {
    console.log('Received data:', req.body);  // ดูข้อมูลที่ได้รับจากฝั่งฟรอนต์
    
    const { course_name, course_description, course_price, course_image, category_id, instructor_id } = req.body;

    if (!course_name || !course_description || isNaN(course_price) || !course_image || !category_id || !instructor_id) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const newCourse = await pool.query(
      `INSERT INTO course 
       (course_name, course_description, course_price, course_image, category_id, instructor_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [course_name, course_description, course_price, course_image, category_id, instructor_id]
    );

    res.status(201).json(newCourse.rows[0]);
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(500).json({ 
      error: 'Failed to create course',
      details: err.message 
    });
  }
};


// ฟังก์ชันสำหรับดึงคอร์สที่ผู้ใช้สร้าง
export const getMyCourses = async (req, res) => {
  try {
    if (!req.instructor?.id) {
      return res.status(403).json({ message: 'คุณไม่มีสิทธิ์เข้าถึง เนื่องจากไม่ใช่ผู้สอน' });
    }

    const result = await pool.query(
      `SELECT 
        c.id,
        c.course_name AS title,
        c.course_description AS description,
        c.course_price AS price,
        c.course_image AS thumbnail,
        ca.name AS category
       FROM course c
       LEFT JOIN categories ca ON c.category_id = ca.id
       WHERE c.instructor_id = $1`,
      [req.instructor.id]
    );

    res.status(200).json({ courses: result.rows });
  } catch (err) {
    console.error('Error loading instructor courses:', err);
    res.status(500).json({ message: 'ไม่สามารถดึงคอร์สได้', error: err.message });
  }
};
export const getAllCourses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM course');
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying database:', err); // เพิ่มการตรวจสอบ
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคอร์ส', error: err.message });
  }
};


// ฟังก์ชันสำหรับดึงคอร์สตาม ID
// ฟังก์ชันสำหรับดึงคอร์สตาม ID พร้อมกับนับจำนวนบทเรียน
export const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    // แก้ไข SQL ให้ JOIN ตาราง instructor/ผู้สอน เพื่อดึงชื่อผู้สอนมาด้วย
    const courseResult = await pool.query(
      `SELECT 
        c.id,
        c.course_name AS title,
        c.course_description AS description,
        c.course_price AS price,
        c.course_image AS thumbnail,
        ca.name AS category,
        c.instructor_id,
        u.instructor_name  -- เพิ่มตรงนี้เพื่อดึงชื่อผู้สอนจากตาราง users (หรือ ตารางผู้สอน)
       FROM course c
       LEFT JOIN categories ca ON c.category_id = ca.id
       LEFT JOIN instructors u ON c.instructor_id = u.id  -- สมมติว่า instructor_id ใน course เชื่อมกับ id ใน users
       WHERE c.id = $1`,
      [id]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบคอร์สนี้' });
    }

    // นับจำนวนบทเรียนในคอร์สนั้น
    const lessonCountResult = await pool.query(
      `SELECT COUNT(*) AS lesson_count FROM lesson WHERE id = $1`,  // แก้ไข WHERE ให้ถูกต้องเป็น course_id
      [id]
    );

    // รวมข้อมูลคอร์สและจำนวนบทเรียน
    const courseData = {
      ...courseResult.rows[0],
      lesson_count: lessonCountResult.rows[0].lesson_count
    };

    res.status(200).json(courseData);
  } catch (err) {
    console.error('Error fetching course by ID:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคอร์ส', error: err.message });
  }
};



// ฟังก์ชันสำหรับอัปเดตคอร์ส
// ฟังก์ชันสำหรับอัปเดตคอร์ส
export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, thumbnail, category_id } = req.body;

  try {
    // ตรวจสอบว่าคอร์สนั้นมีอยู่จริงและเป็นของ instructor คนนี้หรือไม่
    const checkCourse = await pool.query('SELECT instructor_id FROM course WHERE id = $1', [id]);

    if (checkCourse.rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบคอร์สที่ต้องการอัปเดต' });
    }

    if (checkCourse.rows[0].instructor_id !== req.instructor?.id) {
      return res.status(403).json({ message: 'คุณไม่มีสิทธิ์อัปเดตคอร์สนี้' });
    }

    const result = await pool.query(
      'UPDATE course SET course_name = $1, course_description = $2, course_price = $3, course_image = $4, category_id = $5 WHERE id = $6 RETURNING *',
      [title, description, price, thumbnail, category_id, id]
    );

    return res.status(200).json({ message: 'อัปเดตคอร์สสำเร็จ', course: result.rows[0] });
  } catch (err) {
    console.error('Error updating course:', err);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตคอร์ส', error: err.message });
  }
};

// ฟังก์ชันสำหรับลบคอร์ส
export const deleteCourse = async (req, res) => {
  console.log('Authenticated instructor:', req.instructor);
  console.log('Authenticated admin:', req.admin);

  const { id } = req.params;

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // เริ่ม transaction

    // 1. ดึงข้อมูลคอร์ส
    const courseResult = await client.query(
      'SELECT course_image, instructor_id FROM course WHERE id = $1',
      [id]
    );

    if (courseResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'ไม่พบคอร์สที่ต้องการลบ' });
    }

    // 2. ตรวจสอบสิทธิ์ (เจ้าของคอร์สหรือแอดมิน)
    const isInstructor = courseResult.rows[0].instructor_id === req.instructor?.id;
    const isAdmin = req.admin?.admin_id;

    if (!isInstructor && !isAdmin) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'ไม่มีสิทธิ์ลบคอร์สนี้' });
    }

    const courseImage = courseResult.rows[0].course_image;

    // 3. ลบข้อมูลในตารางลูก (เช่น comments, videos)
    await client.query('DELETE FROM comments WHERE course_id = $1', [id]);
    await client.query('DELETE FROM lesson WHERE id = $1', [id]);
    // ถ้ามีตารางอื่นที่อ้างอิง course_id ให้ลบเพิ่มที่นี่ด้วย

    // 4. ลบคอร์สหลัก
    await client.query('DELETE FROM course WHERE id = $1', [id]);

    await client.query('COMMIT'); // ยืนยันการลบทั้งหมด

    // 5. ลบรูปภาพใน Cloudinary หลังจาก commit สำเร็จ
    if (courseImage) {
      try {
        const publicId = getPublicIdFromUrl(courseImage);
        if (!publicId) {
          console.warn('ไม่สามารถดึง public_id จาก URL:', courseImage);
        } else {
          const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
          console.log('Cloudinary deletion result:', result);
        }
      } catch (cloudinaryErr) {
        console.error('Cloudinary deletion error:', cloudinaryErr);
        // ไม่จำเป็นต้องส่ง error กลับไป เพราะลบใน DB สำเร็จแล้ว
      }
    }

    res.status(200).json({ message: 'ลบคอร์สและข้อมูลที่เกี่ยวข้องสำเร็จ' });
  } catch (err) {
    await client.query('ROLLBACK'); // ยกเลิก transaction หากมี error
    console.error('Error deleting course:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบคอร์ส', error: err.message });
  } finally {
    client.release();
  }
};


