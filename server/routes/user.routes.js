import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// @route   GET api/user/me
// @desc    Get current user
// @access  Private
router.get('/me', (req, res) => {
  res.json(req.user);
});


export const userRoutes = router;