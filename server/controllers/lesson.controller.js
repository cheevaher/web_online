import { pool } from '../config/db.js';

// ✅ เพิ่มบทเรียนใหม่ในคอร์ส
export const createLesson = async (req, res) => {
  const { courseId } = req.params;  // ดึง courseId แทน id
  const { lesson_name, description, video_url, lesson_type } = req.body;

  // เพิ่มการพิมพ์ req.body เพื่อตรวจสอบข้อมูลที่ได้รับจาก client
  console.log('Received body:', req.body);  // ตรวจสอบค่าที่ได้รับจาก client

  if (isNaN(courseId)) {
      return res.status(400).json({ message: 'Course ID ไม่ถูกต้อง' });
  }

  try {
      // ตรวจสอบว่าคอร์สมีอยู่จริงไหม
      const courseCheck = await pool.query(
          `SELECT * FROM course WHERE id = $1`,
          [courseId]
      );

      if (courseCheck.rows.length === 0) {
          return res.status(404).json({ message: 'ไม่พบคอร์สที่ต้องการเพิ่มบทเรียน' });
      }

      // เพิ่มบทเรียนใหม่ (กำหนด course_id ให้ถูก)
      const result = await pool.query(
          `INSERT INTO lesson (id, lesson_name, lesson_type, description, video_url)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [courseId, lesson_name, lesson_type, description, video_url]
      );

      res.status(201).json(result.rows[0]);
  } catch (err) {
      console.error('Error creating lesson:', err);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มบทเรียน' });
  }
};


// ✅ ดึงบทเรียนทั้งหมดของคอร์ส
export const getLessonsByCourseId = async (req, res) => {
    const { courseId } = req.params;

    if (isNaN(courseId)) {
        return res.status(400).json({ message: 'Course ID ไม่ถูกต้อง' });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM lesson WHERE id = $1 ORDER BY lesson_id ASC`,
            [courseId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching lessons:', err);
        res.status(500).json({ message: 'ไม่สามารถดึงบทเรียนได้' });
    }
};

// ✅ ดึงบทเรียนเดี่ยวตาม lessonId
export const getLessonById = async (req, res) => {
    const { lessonId } = req.params;

    if (isNaN(lessonId)) {
        return res.status(400).json({ message: 'Lesson ID ไม่ถูกต้อง' });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM lesson WHERE lesson_id = $1`,
            [lessonId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบบทเรียน' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching lesson:', err);
        res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลบทเรียนได้' });
    }
};

// ✅ แก้ไขบทเรียน
export const updateLesson = async (req, res) => {
    const { lessonId } = req.params;
    const { lesson_name, description, video_url, lesson_type } = req.body;

    try {
        const result = await pool.query(
            `UPDATE lesson 
             SET lesson_name = $1, lesson_type = $2, description = $3, video_url = $4 
             WHERE lesson_id = $5
             RETURNING *`,
            [lesson_name, lesson_type, description, video_url, lessonId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบบทเรียนที่จะแก้ไข' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating lesson:', err);
        res.status(500).json({ message: 'ไม่สามารถอัปเดตบทเรียนได้' });
    }
};

// ✅ ลบบทเรียน
export const deleteLesson = async (req, res) => {
    const { lessonId } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM lesson WHERE lesson_id = $1 RETURNING *`,
            [lessonId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบบทเรียนที่ต้องการลบ' });
        }

        res.status(200).json({ message: 'ลบบทเรียนเรียบร้อยแล้ว' });
    } catch (err) {
        console.error('Error deleting lesson:', err);
        res.status(500).json({ message: 'ไม่สามารถลบบทเรียนได้' });
    }
};
