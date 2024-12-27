import mongoose from 'mongoose';
import pluralize from 'pluralize';
import { PERMISSIONS } from '../constants/index.js';

export const sendResponse = (res, statusCode, message, data) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const flattenObject = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], newKey));
    } else {
      acc[newKey] = obj[key];
    }

    return acc;
  }, {});
};

export const lowercaseFirstLetter = str => {
  if (!str) {
    return str;
  }

  return str.at(0).toLowerCase() + str.slice(1);
};

export const formatCastError = error => {
  if (!(error instanceof mongoose.Error.CastError)) {
    return error.message;
  }

  return `Invalid value provided for ${error.path}. Expected a valid ${lowercaseFirstLetter(
    error.kind
  )} but received '${error.value}'`;
};

export const atLeastOnePermission = permissions => permissions.length > 0;

export const checkValidPermissions = permissions => {
  const validPermissions = Object.values(flattenObject(PERMISSIONS));
  return permissions.every(permission => validPermissions.includes(permission));
};

export const stripObjectKeys =
  (...keys) =>
  (value, _helpers) => {
    for (const key of keys) {
      delete value[key];
    }

    return value;
  };

export const validateObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }

  return value;
};

export const checkPermissions = (value, helpers) => {
  const permissions = [...new Set(value)];

  if (!checkValidPermissions(permissions)) {
    return helpers.error('any.invalid');
  }

  return permissions;
};

export const formatOptions = options => {
  const optionsList = Object.values(flattenObject(options));

  if (!optionsList.length) {
    return '';
  }

  if (optionsList.length === 1) {
    return optionsList[0];
  }

  if (optionsList.length === 2) {
    return optionsList.join(' and ');
  }

  const lastOption = optionsList.pop();
  return optionsList.join(', ') + ' and ' + lastOption;
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const capitalizeFirstLetter = str => {
  if (!str) {
    return str;
  }

  return str.at(0).toUpperCase() + str.slice(1);
};

export const singularize = str => pluralize.singular(str);

export const hasAllPermissions = permissions =>
  Object.values(flattenObject(PERMISSIONS)).every(permission => permissions.includes(permission));

export const isOnlyRootUser = user => {
  let isRootUser = false;

  if (user.role && hasAllPermissions(user.role.permissions) && user.role.userCount === 1) {
    isRootUser = true;
  }

  return isRootUser;
};

export const deepFreeze = obj => {
  Object.freeze(obj);

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Object.isFrozen(obj[key])) {
      deepFreeze(obj[key]);
    }
  });

  return obj;
};
