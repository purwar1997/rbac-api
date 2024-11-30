import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { stripObjectKeys, validateObjectId } from '../utils/helperFunctions.js';
import { REGEX } from '../constants/index.js';

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
        'Password must be 6-20 characters long and should contain atleast one digit, one letter and one special character',
    }),

    confirmPassword: Joi.any().valid(Joi.ref('password')).messages({
      'any.only': "Confirm password doesn't match with password",
    }),
  })
  .with('password', 'confirmPassword')
  .custom(stripObjectKeys('confirmPassword'))
  .messages({
    'object.with': 'Confirm password is required',
  });

export const userIdSchema = Joi.string()
  .trim()
  .empty(':userId')
  .custom(validateObjectId)
  .required()
  .messages({
    'any.required': 'User ID is required',
    'string.empty': 'User ID cannot be empty',
    'any.invalid': 'User ID is invalid. Expected a valid objectId',
  });

export const roleSchema = customJoi.object({
  role: Joi.string().trim().required().custom(validateObjectId).messages({
    'any.required': 'Role is required',
    'string.base': 'Role must be a string',
    'string.empty': 'Role cannot be empty',
    'any.invalid': 'Invalid ID format. Role must be a valid objectId',
  }),
});
