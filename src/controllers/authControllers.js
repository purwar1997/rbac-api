import crypto from 'crypto';
import User from '../models/user.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/CustomError.js';
import sendEmail from '../services/sendEmail.js';
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

// Allows authenticated users to log out
export const logout = handleAsync(async (_req, res) => {
  res.clearCookie('token', clearCookieOptions);

  sendResponse(res, 200, 'User logged out successfully');
});

// Sends an email to the user with reset password link
export const forgotPassword = handleAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError('No user registered with this email', 400);
  }

  const resetPasswordToken = user.generateForgotPasswordToken();
  await user.save();

  const resetPasswordUrl = `${req.protocol}://${req.hostname}/reset-password/${resetPasswordToken}`;

  try {
    const options = {
      recipient: email,
      subject: 'Reset your password',
      text: `To reset your password, copy-paste the following link in browser and hit enter: ${resetPasswordUrl}.`,
    };

    await sendEmail(options);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();
    throw new CustomError('Failed to send reset password email to the user', 500);
  }

  sendResponse(res, 200, 'Password reset email sent successfully');
});

// Allows users to reset their account password
export const resetPassword = handleAsync(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const encryptedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOneAndUpdate(
    { resetPasswordToken: encryptedToken, resetPasswordExpiry: { $gt: new Date() } },
    {
      password,
      $unset: { resetPasswordToken: 1, resetPasswordExpiry: 1 },
    },
    { runValidators: true }
  );

  if (!user) {
    throw new CustomError('Reset password token is either invalid or expired', 400);
  }

  sendResponse(res, 200, 'Password has been reset successfully');
});
