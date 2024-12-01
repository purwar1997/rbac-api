import mongoose from 'mongoose';
import { PERMISSIONS } from '../constants/index.js';

export const sendResponse = (res, statusCode, message, data) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
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

export const atleastOnePermission = permissions => permissions.length > 0;

export const arePermissionsValid = permissions => {
  const validPermissions = Object.values(PERMISSIONS);
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

  if (!arePermissionsValid(permissions)) {
    return helpers.error('any.invalid');
  }

  return value;
};

export const formatOptions = options => {
  const optionsList = Object.values(options);

  if (!optionsList.length) {
    return [];
  }

  if (optionsList.length === 1) {
    return optionsList[0];
  }

  if (optionsList.length === 2) {
    return optionsList.join(' and ');
  }

  const lastOption = optionsList.pop();
  return optionsList.join(', ') + 'and ' + lastOption;
};
