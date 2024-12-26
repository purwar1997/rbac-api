import express from 'express';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddlewares.js';
import { validatePathParams, validatePayload } from '../middlewares/requestValidators.js';
import { parseFormData } from '../middlewares/parseFormData.js';
import { checkUserSelfAction } from '../middlewares/checkUserSelfAction.js';
import { updateProfileSchema, userIdSchema, roleSchema } from '../schemas/userSchemas.js';
import {
  getUserProfile,
  updateUserProfile,
  deleteAccount,
  addProfilePhoto,
  updateProfilePhoto,
  removeProfilePhoto,
  getUsers,
  getUserById,
  assignRoleToUser,
  unassignRoleFromUser,
  activateUser,
  deactivateUser,
  archiveUser,
  restoreArchivedUser,
  deleteUser,
} from '../controllers/userControllers.js';
import { PERMISSIONS, FILE_UPLOAD } from '../constants/index.js';

const router = express.Router();

router.route('/').get(isAuthenticated, getUsers);

router
  .route('/self')
  .all(isAuthenticated)
  .get(getUserProfile)
  .put(validatePayload(updateProfileSchema), updateUserProfile)
  .delete(deleteAccount);

router
  .route('/self/avatar')
  .all(isAuthenticated)
  .post(parseFormData(FILE_UPLOAD.FOLDER_NAME, FILE_UPLOAD.FILE_NAME), addProfilePhoto)
  .put(removeProfilePhoto);

router
  .route('/self/avatar/update')
  .post(
    isAuthenticated,
    parseFormData(FILE_UPLOAD.FOLDER_NAME, FILE_UPLOAD.FILE_NAME),
    updateProfilePhoto
  );

router
  .route('/:userId')
  .all(isAuthenticated)
  .get(isAuthorized(PERMISSIONS.USER.VIEW), validatePathParams(userIdSchema), getUserById)
  .delete(
    isAuthorized(PERMISSIONS.USER.DELETE),
    validatePathParams(userIdSchema),
    checkUserSelfAction(PERMISSIONS.USER.DELETE),
    deleteUser
  );

router
  .route('/:userId/role/assign')
  .patch(
    isAuthenticated,
    isAuthorized(PERMISSIONS.ROLE.ASSIGN),
    validatePathParams(userIdSchema),
    validatePayload(roleSchema),
    checkUserSelfAction(PERMISSIONS.ROLE.ASSIGN),
    assignRoleToUser
  );

router
  .route('/:userId/role/unassign')
  .patch(
    isAuthenticated,
    isAuthorized(PERMISSIONS.ROLE.UNASSIGN),
    validatePathParams(userIdSchema),
    checkUserSelfAction(PERMISSIONS.ROLE.UNASSIGN),
    unassignRoleFromUser
  );

router
  .route('/:userId/activate')
  .patch(
    isAuthenticated,
    isAuthorized(PERMISSIONS.USER.ACTIVATE),
    validatePathParams(userIdSchema),
    checkUserSelfAction(PERMISSIONS.USER.ACTIVATE),
    activateUser
  );

router
  .route('/:userId/deactivate')
  .patch(
    isAuthenticated,
    isAuthorized(PERMISSIONS.USER.DEACTIVATE),
    validatePathParams(userIdSchema),
    checkUserSelfAction(PERMISSIONS.USER.DEACTIVATE),
    deactivateUser
  );

router
  .route('/:userId/archive')
  .patch(
    isAuthenticated,
    isAuthorized(PERMISSIONS.USER.ARCHIVE),
    validatePathParams(userIdSchema),
    checkUserSelfAction(PERMISSIONS.USER.ARCHIVE),
    archiveUser
  );

router
  .route('/:userId/restore')
  .patch(
    isAuthenticated,
    isAuthorized(PERMISSIONS.USER.RESTORE),
    validatePathParams(userIdSchema),
    checkUserSelfAction(PERMISSIONS.USER.RESTORE),
    restoreArchivedUser
  );

export default router;
