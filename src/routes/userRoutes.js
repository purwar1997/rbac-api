import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { validatePayload } from '../middlewares/requestValidators.js';
import { updateProfileSchema } from '../schemas/userSchemas.js';
import {
  getUserProfile,
  updateUserProfile,
  deleteAccount,
} from '../controllers/userControllers.js';

const router = express.Router();

router
  .route('/self')
  .all(isAuthenticated)
  .get(getUserProfile)
  .put(validatePayload(updateProfileSchema), updateUserProfile)
  .delete(deleteAccount);

export default router;
