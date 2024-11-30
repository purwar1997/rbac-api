import User from '../models/user.js';
import Role from '../models/role.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/CustomError.js';
import { sendResponse } from '../utils/helperFunctions.js';
import { clearCookieOptions } from '../utils/cookieOptions.js';

export const getUserProfile = handleAsync(async (_req, res) => {
  const { user } = res;

  sendResponse(res, 200, 'Profile fetched successfully', user);
});

export const updateUserProfile = handleAsync(async (req, res) => {
  const updates = req.body;

  if (!updates.password) {
    delete updates.password;
  }

  const userByPhone = await User.findOne({ phone: updates.phone, _id: { $ne: req.user._id } });

  if (userByPhone) {
    throw new CustomError(
      'This phone number is being used by another user. Please set a different phone number',
      409
    );
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    runValidators: true,
    new: true,
  });

  sendResponse(res, 200, 'Profile updated successfully', updatedUser);
});

export const deleteAccount = handleAsync(async (req, res) => {
  const userId = req.user._id;

  await User.findByIdAndDelete(userId);

  res.clearCookie('token', clearCookieOptions);

  sendResponse(res, 200, 'Account deleted successfully');
});

export const getAllUsers = handleAsync(async (_req, res) => {
  const users = await User.find({ isArchived: false })
    .select({
      fullname: 1,
      email: 1,
      phone: 1,
      role: 1,
      avatar: 1,
      isActive: 1,
    })
    .populate({
      path: 'role',
      select: 'title',
    });

  sendResponse(res, 200, 'Users fetched successfully', users);
});

export const getUserById = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate('role');

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  sendResponse(res, 200, 'User fetched by ID successfully', user);
});

export const assignRoleToUser = handleAsync(async (req, res) => {
  const { userId } = req.params;
  const { role: roleId } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const role = await Role.findById(roleId);

  if (!role) {
    throw new CustomError('Provided role does not exist', 404);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role: roleId },
    { runValidators: true, new: true }
  );

  sendResponse(res, 200, 'Role assigned to user successfully', updatedUser);
});

export const removeRoleFromUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const updatedUser = await User.findByIdAndUpdate(userId, { $unset: { role: 1 } }, { new: true });

  if (!updatedUser) {
    throw new CustomError('User not found', 404);
  }

  sendResponse(res, 200, 'Role removed from user successfully', updatedUser);
});

export const activateUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const activatedUser = await User.findByIdAndUpdate(
    userId,
    { isActive: true },
    { runValidators: true, new: true }
  );

  if (!activatedUser) {
    throw new CustomError('User not found', 404);
  }

  sendResponse(res, 200, 'User activated successfully', activatedUser);
});

export const deactivateUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const deactivatedUser = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { runValidators: true, new: true }
  );

  if (!deactivatedUser) {
    throw new CustomError('User not found', 404);
  }

  sendResponse(res, 200, 'User deactivated successfully', deactivatedUser);
});

export const archiveUser = handleAsync(async (req, res) => {});

export const restoreArchivedUser = handleAsync(async (req, res) => {});
