import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js'; // ใช้ pool แทนการนำเข้า db แบบ default

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const result = await pool.query('SELECT id, name, email FROM learner WHERE id = $1', [decoded.userId]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = result.rows[0]; // ใช้ข้อมูลผู้ใช้จาก result.rows[0]
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
