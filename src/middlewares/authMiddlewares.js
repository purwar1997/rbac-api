import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import CustomError from '../utils/CustomError.js';
import handleAsync from '../utils/handleAsync.js';
import config from '../config/env.config.js';
import { PERMISSIONS_DESCRIPTION } from '../constants/index.js';

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
    throw new CustomError('Access denied. User not found', 401);
  }

  req.user = user;
  next();
});

export const isAuthorized = requiredPermission =>
  handleAsync((req, _res, next) => {
    const { user } = req;

    if (!user.role) {
      throw new CustomError(
        "User hasn't been assigned a role and therefore he doesn't have any permissions",
        403
      );
    }

    if (!user.isActive) {
      throw new CustomError(
        'User is currently inactive. Therefore, he is not allowed to use any of his permissions',
        403
      );
    }

    if (!user.role.permissions.includes(requiredPermission)) {
      throw new CustomError(
        `User has been assigned a role of ${user.role.title.toLowerCase()}. Therefore, he doesn't have neccessary permissions to ${PERMISSIONS_DESCRIPTION[
          requiredPermission
        ].toLowerCase()}`,
        403
      );
    }

    next();
  });
