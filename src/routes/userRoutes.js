import express from 'express';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddlewares.js';
import { validatePathParams, validatePayload } from '../middlewares/requestValidators.js';
import { updateProfileSchema, userIdSchema, roleSchema } from '../schemas/userSchemas.js';
import {
  getUserProfile,
  updateUserProfile,
  deleteAccount,
  getAllUsers,
  getUserById,
  assignRoleToUser,
  unassignRoleFromUser,
  updateActiveStatus,
  archiveUser,
  restoreArchivedUser,
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

router
  .route('/:userId')
  .get(
    isAuthenticated,
    isAuthorized(PERMISSIONS.VIEW_USER),
    validatePathParams(userIdSchema),
    getUserById
  );

router
  .route('/:userId/role/assign')
  .put(
    isAuthenticated,
    isAuthorized(PERMISSIONS.ASSIGN_ROLE),
    validatePathParams(userIdSchema),
    validatePayload(roleSchema),
    assignRoleToUser
  );

router
  .route('/:userId/role/unassign')
  .put(
    isAuthenticated,
    isAuthorized(PERMISSIONS.UNASSIGN_ROLE),
    validatePathParams(userIdSchema),
    unassignRoleFromUser
  );

router
  .route('/:userId/status')
  .post(
    isAuthenticated,
    isAuthorized(PERMISSIONS.UPDATE_STATUS),
    validatePathParams(userIdSchema),
    updateActiveStatus
  );

router
  .route('/:userId/archive')
  .put(
    isAuthenticated,
    isAuthorized(PERMISSIONS.ARCHIVE_USER),
    validatePathParams(userIdSchema),
    archiveUser
  );

router
  .route('/:userId/restore')
  .put(
    isAuthenticated,
    isAuthorized(PERMISSIONS.RESTORE_USER),
    validatePathParams(userIdSchema),
    restoreArchivedUser
  );

export default router;
