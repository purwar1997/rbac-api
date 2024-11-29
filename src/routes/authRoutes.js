import express from 'express';
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/authControllers.js';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  tokenSchema,
} from '../schemas/authSchemas.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { validatePathParams, validatePayload } from '../middlewares/requestValidators.js';

const router = express.Router();

router.route('/signup').post(validatePayload(signupSchema), signup);
router.route('/login').post(validatePayload(loginSchema), login);
router.route('/logout').post(isAuthenticated, logout);
router.route('/password/forgot').post(validatePayload(forgotPasswordSchema), forgotPassword);
router
  .route('/password/reset/:token')
  .put(validatePathParams(tokenSchema), validatePayload(resetPasswordSchema), resetPassword);

export default router;
