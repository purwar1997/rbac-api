import Joi from 'joi';
import { PAGE, LIMIT } from '../constants/index.js';

export const pageSchema = Joi.number()
  .integer()
  .min(PAGE.MIN)
  .empty('')
  .default(PAGE.DEFAULT)
  .messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': `Page must be at least ${PAGE.MIN}`,
    'number.unsafe': `Page must be within a safe range of ${Number.MIN_SAFE_INTEGER} and ${Number.MAX_SAFE_INTEGER}`,
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
    'number.max': `Limit must be at most ${LIMIT.MAX}`,
    'number.unsafe': `Limit must be within a safe range of ${Number.MIN_SAFE_INTEGER} and ${Number.MAX_SAFE_INTEGER}`,
  });
