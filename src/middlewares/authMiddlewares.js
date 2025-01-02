import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import CustomError from '../utils/CustomError.js';
import handleAsync from '../utils/handleAsync.js';
import config from '../config/env.config.js';
import { PERMISSIONS_DESCRIPTION } from '../constants/common.js';

export const isAuthenticated = handleAsync(async (req, _res, next) => {
  let token;

  if (req.cookies.token || req.headers.authorization?.startsWith('Bearer')) {
    token = req.cookies.token || req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new CustomError('Access denied. Token not provided', 401);
  }

  const decodedToken = jwt.verify(token, config.auth.jwtSecretKey);
  const user = await User.findById(decodedToken.userId).populate('role');

  if (!user) {
    throw new CustomError('Access denied. User not found', 404);
  }

  req.user = user;
  next();
});

export const isAuthorized = requiredPermission =>
  handleAsync((req, _res, next) => {
    const { user } = req;

    if (!user.role) {
      throw new CustomError(
        'You have not been assigned a role, so you do not have permissions to perform any task',
        403
      );
    }

    if (!user.role.isActive) {
      throw new CustomError(
        'The role you have been assigned is currently inactive, so you are not allowed to perform any task',
        403
      );
    }

    if (!user.isActive) {
      throw new CustomError(
        'You are currently inactive, so you are not allowed to perform any task',
        403
      );
    }

    if (!user.role.permissions.includes(requiredPermission)) {
      throw new CustomError(
        `You have been assigned a role of ${user.role.title.toLowerCase()}, so you do not have necessary permissions to ${PERMISSIONS_DESCRIPTION[
          requiredPermission
        ].toLowerCase()}`,
        403
      );
    }

    next();
  });
