import express from 'express';
import { getCategories, getCoursesByCategoryId  } from '../controllers/category.controller.js';

const router = express.Router();

router.get('/categories', getCategories);
// ✅ เพิ่ม route นี้
router.get('/categories/:id/courses', getCoursesByCategoryId);

export default router;