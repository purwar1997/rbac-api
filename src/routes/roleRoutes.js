import express from 'express';
import { getAllRoles, getRoleById, addNewRole, editRole } from '../controllers/roleControllers.js';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddlewares.js';
import { validatePathParams, validatePayload } from '../middlewares/requestValidators.js';
import { roleIdSchema, roleBodySchema } from '../schemas/roleSchemas.js';
import { PERMISSIONS } from '../constants/index.js';

const router = express.Router();

router
  .route('/')
  .all(isAuthenticated)
  .get(getAllRoles)
  .post(isAuthorized(PERMISSIONS.ADD_ROLE), validatePayload(roleBodySchema), addNewRole);

router
  .route('/:roleId')
  .all(isAuthenticated)
  .get(isAuthorized(PERMISSIONS.VIEW_ROLE, validatePathParams(roleIdSchema), getRoleById))
  .put(
    isAuthorized(PERMISSIONS.EDIT_ROLE),
    validatePathParams(roleIdSchema),
    validatePayload(roleBodySchema),
    editRole
  );

export default router;
