import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { validateObjectId, formatOptions, checkPermissions } from '../utils/helperFunctions.js';
import { limitSchema, pageSchema } from './commonSchemas.js';
import { REGEX, PERMISSIONS } from '../constants/common.js';

export const roleBodySchema = customJoi.object({
  title: Joi.string().trim().pattern(REGEX.NAME).max(50).required().messages({
    'any.required': 'Role title is required',
    'string.base': 'Role title must be a string',
    'string.empty': 'Role title cannot be empty',
    'string.pattern.base': 'Role title must contain only letters',
    'string.max': 'Role title cannot exceed 50 characters',
  }),

  permissions: Joi.array()
    .items(Joi.string())
    .min(1)
    .required()
    .custom(checkPermissions)
    .messages({
      'any.required': 'Permissions are required',
      'array.base': 'Permissions must be an array',
      'array.min': 'Permissions array must contain at least one value',
      'array.includes': 'Permissions array must contain only strings',
      'any.invalid': `Provided invalid permissions. Valid permissions are: ${formatOptions(
        PERMISSIONS
      )}`,
    }),
});

export const roleIdSchema = Joi.object({
  roleId: Joi.string().trim().empty(':roleId').required().custom(validateObjectId).messages({
    'any.required': 'Role ID is required',
    'string.empty': 'Role ID cannot be empty',
    'any.invalid': 'Invalid ID format. Expected a valid objectId',
  }),
});

export const rolesQuerySchema = Joi.object({
  page: pageSchema,
  limit: limitSchema,
});
