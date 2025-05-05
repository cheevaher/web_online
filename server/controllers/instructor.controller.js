import db from '../config/db.js';

export const registerInstructor = async (req, res) => {
  const { instructor_name, instructor_tel, instructor_email, instructor_pad, address } = req.body;

  // ตรวจสอบข้อมูลก่อนการบันทึก
  if (!instructor_name || !instructor_tel || !instructor_email || !instructor_pad || !address) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    // บันทึกข้อมูลผู้สอนลงในฐานข้อมูล
    const result = await db.query(
      `INSERT INTO instructors (instructor_name, instructor_tel, instructor_email, instructor_pad, address)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [instructor_name, instructor_tel, instructor_email, instructor_pad, address]
    );

    // ส่งข้อมูลกลับ
    res.status(201).json({
      message: 'ลงทะเบียนผู้สอนสำเร็จ',
      instructor: result.rows[0],
    });
  } catch (error) {
    console.error('Error registering instructor:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียนผู้สอน' });
  }
};
