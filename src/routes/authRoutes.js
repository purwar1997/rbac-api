import express from 'express';
import { signup, login, logout } from '../controllers/authControllers.js';
import { signupSchema, loginSchema } from '../schemas/authSchemas.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { validatePayload } from '../middlewares/requestValidators.js';

const router = express.Router();

router.route('/signup').post(validatePayload(signupSchema), signup);
router.route('/login').post(validatePayload(loginSchema), login);
router.route('/logout').post(isAuthenticated, logout);

export default router;
