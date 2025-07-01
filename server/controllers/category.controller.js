import { pool } from '../config/db.js';


export const getCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM categories');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};
export const getCoursesByCategoryId = async (req, res) => {
  const { id } = req.params;

  try {
    const categoryRes = await pool.query('SELECT name FROM categories WHERE id = $1', [id]);

    if (categoryRes.rows.length === 0) {
      return res.status(404).json({ message: 'ບໍ່ພົບໝວດໝູ່ນີ້' });
    }

    const courseRes = await pool.query(
  `SELECT id,
          course_name,
          course_description,
          course_image,
          course_price
   FROM course
   WHERE category_id = $1`,
  [id]
);

res.json({
  categoryName: categoryRes.rows[0].name,
  courses: courseRes.rows,
});

  } catch (error) {
    console.error('Error fetching courses by category:', error);
    res.status(500).json({ message: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ' });
  }
};