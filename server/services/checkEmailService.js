import { pool } from '../config/db.js'; // ← ใช้ pool ที่คุณ import ใน app.js

export async function checkEmailExists(email) {
    const userCheck = await pool.query('SELECT id FROM learner WHERE email = $1', [email]);
    const instructorCheck = await pool.query('SELECT id FROM instructors WHERE instructor_email = $1', [email]);
    const adminCheck = await pool.query('SELECT admin_id FROM admin WHERE admin_email = $1', [email]);

    return userCheck.rows.length > 0 || instructorCheck.rows.length > 0 || adminCheck.rows.length > 0;
}
