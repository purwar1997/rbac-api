import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import {
  validateObjectId,
  formatOptions,
  checkPermissions,
  validateCommaSeparatedValues,
  flattenObject,
} from '../utils/helperFunctions.js';
import { activeSchema, limitSchema, orderSchema, pageSchema } from './commonSchemas.js';
import { REGEX, PERMISSIONS } from '../constants/common.js';
import { ROLE_SORT_OPTIONS } from '../constants/sortOptions.js';

export const roleBodySchema = customJoi.object({
  title: Joi.string().trim().pattern(REGEX.NAME).max(50).required().messages({
    'any.required': 'Role title is required',
    'string.base': 'Role title must be a string',
    'string.empty': 'Role title cannot be empty',
    'string.pattern.base': 'Role title must contain only letters',
    'string.max': 'Role title cannot exceed 50 characters',
  }),

  permissions: Joi.array()
    .items(
      Joi.string().allow('').messages({ 'string.base': 'Every single permission must be a string' })
    )
    .min(1)
    .required()
    .custom(checkPermissions)
    .messages({
      'any.required': 'Permissions are required',
      'array.base': 'Permissions must be an array',
      'array.min': 'Permissions array must contain at least one value',
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
  permissions: Joi.string()
    .custom(validateCommaSeparatedValues(PERMISSIONS))
    .empty('')
    .default([])
    .messages({
      'string.base': 'Permissions must be a string',
      'any.invalid': `Provided invalid permissions. Valid permissions are: ${formatOptions(
        flattenObject(PERMISSIONS)
      )}`,
    }),

  active: activeSchema,

  sortBy: Joi.string()
    .trim()
    .lowercase()
    .valid(...Object.values(ROLE_SORT_OPTIONS))
    .allow('')
    .messages({
      'string.base': 'Sort option must be a string',
      'any.only': `Invalid sort value. Valid options are: ${formatOptions(ROLE_SORT_OPTIONS)}`,
    }),

  order: orderSchema,
  page: pageSchema,
  limit: limitSchema,
});
