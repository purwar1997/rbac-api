import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import CustomError from '../utils/CustomError.js';
import handleAsync from '../utils/handleAsync.js';
import config from '../config/env.config.js';

export const isAuthenticated = handleAsync(async (req, _res, next) => {
  let token;

  if (req.cookies.token || req.headers.authorization?.startsWith('Bearer')) {
    token = req.cookies.token || req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new CustomError('Access denied. Token not provided', 401);
  }

  const decodedToken = jwt.verify(token, config.auth.jwtSecretKey);

  const user = await User.findOne({ _id: decodedToken.userId });

  if (!user) {
    throw new CustomError('Access denied. User not found', 401);
  }

  req.user = user;
  next();
});
