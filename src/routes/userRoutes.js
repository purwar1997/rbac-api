import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { validatePayload } from '../middlewares/requestValidators.js';
import { updateProfileSchema } from '../schemas/userSchemas.js';
import {
  getUserProfile,
  updateUserProfile,
  deleteAccount,
  getAllUsers,
  getUserById,
} from '../controllers/userControllers.js';
import { PERMISSIONS } from '../constants/index.js';

const router = express.Router();

router.route('/').get(isAuthenticated, getAllUsers);

router
  .route('/self')
  .all(isAuthenticated)
  .get(getUserProfile)
  .put(validatePayload(updateProfileSchema), updateUserProfile)
  .delete(deleteAccount);

router.route('/:userId').get(isAuthenticated, isAuthorized(PERMISSIONS.VIEW_USER), getUserById);

export default router;
