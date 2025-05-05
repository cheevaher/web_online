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