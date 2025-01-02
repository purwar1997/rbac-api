import express from 'express';
import {
  getRoles,
  getRoleById,
  addNewRole,
  updateRole,
  deleteRole,
  activateRole,
  deactivateRole,
} from '../controllers/roleControllers.js';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddlewares.js';
import {
  validatePathParams,
  validateQueryParams,
  validatePayload,
} from '../middlewares/requestValidators.js';
import { roleIdSchema, roleBodySchema, rolesQuerySchema } from '../schemas/roleSchemas.js';
import { PERMISSIONS } from '../constants/index.js';

const router = express.Router();

router
  .route('/')
  .all(isAuthenticated)
  .get(validateQueryParams(rolesQuerySchema), getRoles)
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

router
  .route('/:roleId/activate')
  .put(
    isAuthenticated,
    isAuthorized(PERMISSIONS.ROLE.ACTIVATE),
    validatePathParams(roleIdSchema),
    activateRole
  );

router
  .route('/:roleId/deactivate')
  .put(
    isAuthenticated,
    isAuthorized(PERMISSIONS.ROLE.DEACTIVATE),
    validatePathParams(roleIdSchema),
    deactivateRole
  );

export default router;
