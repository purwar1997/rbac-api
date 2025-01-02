import express from 'express';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddlewares.js';
import {
  validatePathParams,
  validateQueryParams,
  validatePayload,
} from '../middlewares/requestValidators.js';
import { parseFormData } from '../middlewares/parseFormData.js';
import { checkUserSelfAction } from '../middlewares/checkUserSelfAction.js';
import {
  updateProfileSchema,
  userIdSchema,
  roleSchema,
  usersQuerySchema,
} from '../schemas/userSchemas.js';
import {
  getProfile,
  updateProfile,
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
import { PERMISSIONS, FILE_UPLOAD } from '../constants/common.js';

const router = express.Router();

router.route('/').get(isAuthenticated, validateQueryParams(usersQuerySchema), getUsers);

router
  .route('/self')
  .all(isAuthenticated)
  .get(getProfile)
  .put(validatePayload(updateProfileSchema), updateProfile)
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
  .put(
    isAuthenticated,
    isAuthorized(PERMISSIONS.ROLE.ASSIGN),
    validatePathParams(userIdSchema),
    validatePayload(roleSchema),
    checkUserSelfAction(PERMISSIONS.ROLE.ASSIGN),
    assignRoleToUser
  );

router
  .route('/:userId/role/unassign')
  .put(
    isAuthenticated,
    isAuthorized(PERMISSIONS.ROLE.UNASSIGN),
    validatePathParams(userIdSchema),
    checkUserSelfAction(PERMISSIONS.ROLE.UNASSIGN),
    unassignRoleFromUser
  );

router
  .route('/:userId/activate')
  .put(
    isAuthenticated,
    isAuthorized(PERMISSIONS.USER.ACTIVATE),
    validatePathParams(userIdSchema),
    checkUserSelfAction(PERMISSIONS.USER.ACTIVATE),
    activateUser
  );

router
  .route('/:userId/deactivate')
  .put(
    isAuthenticated,
    isAuthorized(PERMISSIONS.USER.DEACTIVATE),
    validatePathParams(userIdSchema),
    checkUserSelfAction(PERMISSIONS.USER.DEACTIVATE),
    deactivateUser
  );

router
  .route('/:userId/archive')
  .put(
    isAuthenticated,
    isAuthorized(PERMISSIONS.USER.ARCHIVE),
    validatePathParams(userIdSchema),
    checkUserSelfAction(PERMISSIONS.USER.ARCHIVE),
    archiveUser
  );

router
  .route('/:userId/restore')
  .put(
    isAuthenticated,
    isAuthorized(PERMISSIONS.USER.RESTORE),
    validatePathParams(userIdSchema),
    checkUserSelfAction(PERMISSIONS.USER.RESTORE),
    restoreArchivedUser
  );

export default router;
