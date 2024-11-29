import User from '../models/user.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { setCookieOptions, clearCookieOptions } from '../utils/cookieOptions.js';
import { sendResponse } from '../utils/helperFunctions.js';

// Allows users to create an account
export const signup = handleAsync(async (req, res) => {
  const { firstname, lastname, email, phone, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    throw new CustomError('User with this email already exists', 409);
  }

  const userByPhone = await User.findOne({ phone });

  if (userByPhone) {
    throw new CustomError(
      'This phone number is linked to another user. Please provide a different phone number',
      409
    );
  }

  const newUser = await User.create({ firstname, lastname, email, phone, password });
  newUser.password = undefined;

  sendResponse(res, 201, 'User signed up successfully', newUser);
});

// Allows users to login using their email address and password
export const login = handleAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new CustomError('No user registered with this email', 400);
  }

  const passwordMatch = await user.comparePassword(password);

  if (!passwordMatch) {
    throw new CustomError('Incorrect password', 401);
  }

  const accessToken = user.generateJWTToken();

  res.cookie('token', accessToken, setCookieOptions);

  sendResponse(res, 200, 'User logged in successfully');
});

// Allows users to log out
export const logout = handleAsync(async (_req, res) => {
  res.clearCookie('token', clearCookieOptions);

  sendResponse(res, 200, 'User logged out successfully');
});
