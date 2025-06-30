import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db.js';
import uploadRoutes from './routes/upload.routes.js';
import courseRoutes from './routes/course.routes.js';
import categoryRoutes from './routes/category.routes.js';
import lessonRoutes from './routes/lesson.route.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { createPaymentIntent } from './controllers/paymentController.js';
import authRoutes from './routes/auth.routes.js';
import { userRoutes } from './routes/user.routes.js';
import { instructorRoutes } from './routes/instructor.routes.js';

import purchaseRoutes from './routes/purchase.routes.js';
import userCoursesRoutes from './routes/userCourses.js';
import commentRoutes from './routes/comment.routes.js';
import adminRoutes from './routes/adminRoutes.js'; // ✅ แบบ ES Module
import { getUsersReport, getCoursesReport, getSalesReport, getInstructorSalesReport } from './controllers/report.controller.js';
import { checkEmailExists } from './services/checkEmailService.js'; // ✅ แบบ ES Module

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
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/upload', uploadRoutes); 
app.use('/api/courses', courseRoutes);
app.use('/api', lessonRoutes);
app.use('/api', categoryRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/reports/users', getUsersReport);
app.get('/api/reports/courses',getCoursesReport); 
app.get('/api/reports/sales', getSalesReport); 
app.get('/api/reports/instructor-sales/:instructorId', getInstructorSalesReport);
app.get('/api/check-email/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const exists = await checkEmailExists(email);
        res.json({ exists });
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

 // ✅ เพิ่มเส้นทางนี้เพื่อให้สามารถเข้าถึงรายงานการขายของผู้สอนได้
// ✅ ✅ ✅ เพิ่มอันนี้เข้าไป (เชื่อมต่อ route ที่เพิ่ง import มา)
app.use('/api/user-courses', userCoursesRoutes); // ← เส้นทางที่ใช้เช็คหรือบันทึกการซื้อ

// เพิ่ม Route สำหรับการสร้าง PaymentIntent
app.post('/api/payment/create-payment-intent', createPaymentIntent);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// เริ่มต้นเซิร์ฟเวอร์
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
