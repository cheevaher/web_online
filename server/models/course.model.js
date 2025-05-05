import { pool } from '../config/db.js';

// ฟังก์ชันสำหรับเพิ่มคอร์ส
export const addCourse = async (courseData) => {
  const { Course_Name, Course_Description, Course_Price, Course_Image, Category_id } = courseData;

  const result = await pool.query(
    'INSERT INTO Course (Course_Name, Course_Description, Course_Price, Course_Image, Category_id) VALUES (?, ?, ?, ?, ?)',
    [Course_Name, Course_Description, Course_Price, Course_Image, Category_id]
  );

  return result.insertId;
};