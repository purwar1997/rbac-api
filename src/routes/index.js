import express from 'express';
import authRouter from './authRoutes.js';
import userRouter from './userRoutes.js';
import roleRouter from './roleRoutes.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/roles', roleRouter);

export default router;
