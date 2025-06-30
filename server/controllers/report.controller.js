// controllers/report.controller.js
import { pool } from '../config/db.js';

export const getUsersReport = async (req, res) => {
  try {
const result = await pool.query(`
  SELECT 
    u.id, 
    u.username, 
    u.email, 
    u.created_at AS registered_date,
    COUNT(uc.course_id) AS courses_purchased,
    COALESCE(
      json_agg(
        DISTINCT jsonb_build_object('title', c.course_name)
      ) FILTER (WHERE c.id IS NOT NULL), '[]'
    ) AS courses
  FROM learner u
  LEFT JOIN Enroll uc ON u.id = uc.user_id
  LEFT JOIN course c ON uc.course_id = c.id
  GROUP BY u.id
  ORDER BY u.id
`);


    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching learner report:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายงาน', error: err.message });
  }
};
export const getCoursesReport = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id, 
        c.course_name, 
        c.course_price, 
        i.instructor_name AS instructor,
        cat.name AS category,
        COUNT(DISTINCT l.lesson_id) AS video_count,
        COUNT(DISTINCT uc.user_id) AS purchase_count,
        c.created_at
      FROM course c
      LEFT JOIN instructors i ON c.instructor_id = i.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN lesson l ON l.id = c.id
      LEFT JOIN Enroll uc ON uc.course_id = c.id
      GROUP BY c.id, i.instructor_name, cat.name;
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error getting courses report:', error);
    res.status(500).json({ message: 'Error getting courses report', error: error.message });
  }
};
export const getSalesReport = async (req, res) => {
  const groupBy = req.query.groupBy || 'day';  // default = day

  let selectClause = '';
  let groupClause = '';
  
  if (groupBy === 'day') {
    selectClause = `DATE_TRUNC('day', uc.purchased_at) AS period_start`;
    groupClause = `period_start`;
  } else if (groupBy === 'week') {
    // วันที่เริ่มต้นสัปดาห์ (วันจันทร์)
    selectClause = `DATE_TRUNC('week', uc.purchased_at) AS period_start`;
    groupClause = `period_start`;
  } else if (groupBy === 'month') {
    selectClause = `DATE_TRUNC('month', uc.purchased_at) AS period_start`;
    groupClause = `period_start`;
  } else {
    return res.status(400).json({ message: 'Invalid groupBy parameter' });
  }

  try {
    const query = `
      SELECT
        ${selectClause},
        c.course_name,
        i.instructor_name,
        COUNT(*) AS sales_count,
        ROUND(AVG(uc.price)::numeric, 2) AS price_per_unit,
        ROUND(SUM(uc.price)::numeric, 2) AS total_revenue
      FROM Enroll uc
      JOIN course c ON uc.course_id = c.id
      JOIN instructors i ON c.instructor_id = i.id
      GROUP BY period_start, c.course_name, i.instructor_name
      ORDER BY period_start DESC;
    `;

    const { rows } = await pool.query(query);

    // สำหรับรายสัปดาห์ ให้เพิ่ม period_end (วันอาทิตย์ของสัปดาห์นั้น)
    if (groupBy === 'week') {
      rows.forEach(row => {
        const startDate = new Date(row.period_start);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6); // วันสุดท้ายของสัปดาห์ (วันอาทิตย์)
        row.period_end = endDate.toISOString();  // ส่ง ISO string
        row.period_start = startDate.toISOString();
      });
    } else {
      // แปลง period_start เป็น ISO string (เพื่อให้ frontend parse ได้ง่าย)
      rows.forEach(row => {
        row.period_start = new Date(row.period_start).toISOString();
      });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error getting sales report:', error);
    res.status(500).json({ message: 'Error getting sales report', error: error.message });
  }
};
// controllers/report.controller.js

export const getInstructorSalesReport = async (req, res) => {
  const instructorId = parseInt(req.params.instructorId);


  if (isNaN(instructorId)) {
    return res.status(400).json({ message: 'Invalid instructor ID' });
  }

  try {
    const query = `
      SELECT 
        c.id AS course_id,
        c.course_name,
        c.course_price,
        COUNT(e.id) AS sales_count,
        COALESCE(SUM(e.price), 0) AS total_revenue,
        MAX(e.purchased_at) AS latest_sale
      FROM course c
      LEFT JOIN enroll e ON c.id = e.course_id
      WHERE c.instructor_id = $1
      GROUP BY c.id, c.course_name, c.course_price
      ORDER BY latest_sale DESC NULLS LAST
    `;

    const { rows } = await pool.query(query, [instructorId]);

    const totalRevenue = rows.reduce((sum, course) => sum + Number(course.total_revenue), 0);

    res.json({
      totalRevenue,
      courses: rows,
    });
  } catch (error) {
    console.error('Error fetching instructor sales report:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงรายงานการขาย' });
  }
};

