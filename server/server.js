import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db.js';
import uploadRoutes from './routes/upload.routes.js';
import courseRoutes from './routes/course.routes.js';
import categoryRoutes from './routes/category.routes.js';
import lessonRoutes from './routes/lesson.route.js';
// ตั้งค่า environment variables
dotenv.config();

// เริ่มต้น Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Routes
import authRoutes from './routes/auth.routes.js';
import { userRoutes } from './routes/user.routes.js';
import { instructorRoutes } from './routes/instructor.routes.js';
app.use('/api', lessonRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/upload', uploadRoutes); // ✅ ตรงนี้เปลี่ยนเป็น /api/upload
//app.use('/uploads', express.static('uploads')); // ให้บริการไฟล์ที่อัปโหลด
app.use('/api/courses', courseRoutes);
app.use('/api', categoryRoutes);
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// เริ่มต้นเซิร์ฟเวอร์
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
