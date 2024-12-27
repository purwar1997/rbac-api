import express from 'express';
import {
  getAllRoles,
  getRoleById,
  addNewRole,
  updateRole,
  deleteRole,
} from '../controllers/roleControllers.js';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddlewares.js';
import { validatePathParams, validatePayload } from '../middlewares/requestValidators.js';
import { roleIdSchema, roleBodySchema } from '../schemas/roleSchemas.js';
import { PERMISSIONS } from '../constants/index.js';

const router = express.Router();

router
  .route('/')
  .all(isAuthenticated)
  .get(getAllRoles)
  .post(isAuthorized(PERMISSIONS.ROLE.ADD), validatePayload(roleBodySchema), addNewRole);

router
  .route('/:roleId')
  .all(isAuthenticated)
  .get(isAuthorized(PERMISSIONS.ROLE.VIEW), validatePathParams(roleIdSchema), getRoleById)
  .put(
    isAuthorized(PERMISSIONS.ROLE.UPDATE),
    validatePathParams(roleIdSchema),
    validatePayload(roleBodySchema),
    updateRole
  )
  .delete(isAuthorized(PERMISSIONS.ROLE.DELETE), validatePathParams(roleIdSchema), deleteRole);

export default router;
