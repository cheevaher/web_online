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

// ฟังก์ชันสำหรับดึงคอร์สตาม ID
export const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        c.id,
        c.course_name AS title,
        c.course_description AS description,
        c.course_price AS price,
        c.course_image AS thumbnail,
        ca.name AS category,
        c.instructor_id
       FROM course c
       LEFT JOIN categories ca ON c.category_id = ca.id
       WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบคอร์สนี้' });
    }

    res.status(200).json(result.rows[0]);
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
  const { id } = req.params;

  try {
    // 1. ดึงข้อมูลคอร์ส
    const courseResult = await pool.query(
      'SELECT course_image, instructor_id FROM course WHERE id = $1',
      [id]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบคอร์สที่ต้องการลบ' });
    }

    // 2. ตรวจสอบสิทธิ์ (เฉพาะผู้สอนเจ้าของคอร์ส)
    if (courseResult.rows[0].instructor_id !== req.instructor?.id) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์ลบคอร์สนี้' });
    }

    const courseImage = courseResult.rows[0].course_image;

    // 3. ลบจากฐานข้อมูล
    await pool.query('DELETE FROM course WHERE id = $1', [id]);

    // 4. ลบภาพจาก Cloudinary (ถ้ามี)
    if (courseImage) {
      try {
        const publicId = getPublicIdFromUrl(courseImage);
        if (!publicId) {
          console.warn('Cannot extract public_id from URL:', courseImage);
          return res.status(200).json({ 
            message: 'ลบคอร์สสำเร็จ (แต่ลบภาพไม่สำเร็จ)' 
          });
        }

        const result = await cloudinary.uploader.destroy(publicId, {
          invalidate: true
        });

        console.log('Cloudinary deletion result:', result);
      } catch (cloudinaryErr) {
        console.error('Cloudinary deletion error:', cloudinaryErr);
      }
    }

    res.status(200).json({ message: 'ลบคอร์สและภาพประกอบสำเร็จ' });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบคอร์ส' });
  }
};

