import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import {
  formatOptions,
  stripObjectKeys,
  validateObjectId,
  parseAmpersandSeparatedValues,
} from '../utils/helperFunctions.js';
import { limitSchema, orderSchema, pageSchema } from './commonSchemas.js';
import { REGEX, FILTER_OPTIONS } from '../constants/common.js';
import { USER_SORT_OPTIONS } from '../constants/sortOptions.js';

export const updateProfileSchema = customJoi
  .object({
    firstname: Joi.string().trim().pattern(REGEX.NAME).max(50).required().messages({
      'any.required': 'First name is required',
      'string.base': 'First name must be a string',
      'string.empty': 'First name cannot be empty',
      'string.pattern.base': 'First name must contain only letters',
      'string.max': 'First name cannot exceed 50 characters',
    }),

    lastname: Joi.string().trim().pattern(REGEX.NAME).max(50).allow('').messages({
      'string.base': 'Last name must be a string',
      'string.pattern.base': 'Last name must contain only letters',
      'string.max': 'Last name cannot exceed 50 characters',
    }),

    phone: Joi.string().trim().pattern(REGEX.PHONE).required().messages({
      'any.required': 'Phone number is required',
      'string.base': 'Phone number must be a string',
      'string.empty': 'Phone number cannot be empty',
      'string.pattern.base': 'Please provide a valid phone number',
    }),

    password: Joi.string().pattern(REGEX.PASSWORD).allow('').messages({
      'string.base': 'Password must be a string',
      'string.pattern.base':
        'Password must be 6-20 characters long and should contain at least one digit, one letter, and one special character',
    }),

    confirmPassword: Joi.any().valid(Joi.ref('password')).messages({
      'any.only': 'Confirm password doesn not match with password',
    }),
  })
  .with('password', 'confirmPassword')
  .custom(stripObjectKeys('confirmPassword'))
  .messages({
    'object.with': 'Confirm password is required',
  });

export const roleSchema = customJoi.object({
  role: Joi.string().trim().custom(validateObjectId).required().messages({
    'any.required': 'Role is required',
    'string.base': 'Role must be a string',
    'string.empty': 'Role cannot be empty',
    'any.invalid': 'Invalid ID format. Role must be a valid objectId',
  }),
});

export const userIdSchema = Joi.object({
  userId: Joi.string().trim().empty(':userId').custom(validateObjectId).required().messages({
    'any.required': 'User ID is required',
    'string.empty': 'User ID cannot be empty',
    'any.invalid': 'User ID is invalid. Expected a valid objectId',
  }),
});

export const usersQuerySchema = Joi.object({
  active: Joi.string()
    .trim()
    .lowercase()
    .valid(...Object.values(FILTER_OPTIONS))
    .allow('')
    .messages({
      'string.base': 'Active must be string',
      'any.only': `Invalid value provided for active. Valid options are: ${formatOptions(
        FILTER_OPTIONS
      )}`,
    }),

  archived: Joi.boolean().truthy('yes', '1').falsy('no', '0').default(false).messages({
    'boolean.base': 'Archived must be a boolean value',
  }),

  roles: Joi.string().custom(parseAmpersandSeparatedValues).empty('').default([]).messages({
    'string.base': 'Roles must be a string',
  }),

  sortBy: Joi.string()
    .trim()
    .lowercase()
    .valid(...Object.values(USER_SORT_OPTIONS))
    .allow('')
    .messages({
      'string.base': 'Sort option must be a string',
      'any.only': `Invalid sort value. Valid options are: ${formatOptions(USER_SORT_OPTIONS)}`,
    }),

  order: orderSchema,
  page: pageSchema,
  limit: limitSchema,
});
