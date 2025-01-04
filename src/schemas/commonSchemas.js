import Joi from 'joi';
import { formatOptions } from '../utils/helperFunctions.js';
import { PAGE, LIMIT, ACTIVE_FILTER } from '../constants/common.js';
import { SORT_ORDER } from '../constants/sortOptions.js';

export const pageSchema = Joi.number()
  .integer()
  .min(PAGE.MIN)
  .max(PAGE.MAX)
  .empty('')
  .default(PAGE.DEFAULT)
  .messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': `Page must be at least ${PAGE.MIN}`,
    'number.max': `Page cannot exceed ${PAGE.MAX}`,
    'number.unsafe': `Page must be within a range of ${PAGE.MIN} and ${PAGE.MAX}`,
  });

export const limitSchema = Joi.number()
  .integer()
  .min(LIMIT.MIN)
  .max(LIMIT.MAX)
  .empty('')
  .default(LIMIT.DEFAULT)
  .messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': `Limit must be at least ${LIMIT.MIN}`,
    'number.max': `Limit cannot exceed ${LIMIT.MAX}`,
    'number.unsafe': `Limit must be within a range of ${LIMIT.MIN} and ${LIMIT.MAX}`,
  });

export const orderSchema = Joi.string()
  .trim()
  .lowercase()
  .valid(...Object.values(SORT_ORDER))
  .empty('')
  .default(SORT_ORDER.ASCENDING)
  .messages({
    'string.base': 'Order must be a string',
    'any.only': `Invalid order value. Valid options are: ${formatOptions(SORT_ORDER)}`,
  });

export const activeSchema = Joi.string()
  .trim()
  .lowercase()
  .valid(...Object.values(ACTIVE_FILTER))
  .allow('')
  .messages({
    'string.base': 'Active must be string',
    'any.only': `Provided invalid value for active. Valid options are: ${formatOptions(
      ACTIVE_FILTER
    )}`,
  });
