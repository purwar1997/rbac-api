import User from '../models/user.js';
import Role from '../models/role.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/CustomError.js';
import { sendResponse } from '../utils/helperFunctions.js';
import { clearCookieOptions } from '../utils/cookieOptions.js';

// Allows users to fetch their profile
export const getUserProfile = handleAsync(async (_req, res) => {
  const { user } = res;

  sendResponse(res, 200, 'Profile fetched successfully', user);
});

// Allows users to update their profile details
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

// Allows users to delete their account
export const deleteAccount = handleAsync(async (req, res) => {
  const userId = req.user._id;

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    throw new CustomError('User not found', 404);
  }

  if (deletedUser.role) {
    await Role.findByIdAndUpdate(deletedUser.role, { $inc: { userCount: -1 } });
  }

  res.clearCookie('token', clearCookieOptions);

  sendResponse(res, 200, 'Account deleted successfully');
});

// Allows admins to fetch a list of all users
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
    .populate('role');

  sendResponse(res, 200, 'Users fetched successfully', users);
});

// Allows admins to fetch a user by ID
export const getUserById = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate('role');

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  sendResponse(res, 200, 'User fetched by ID successfully', user);
});

// Allows admins to assign a role to user
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
  ).populate('role');

  await Role.findByIdAndUpdate(roleId, { $inc: { userCount: 1 } });

  if (user.role) {
    await Role.findByIdAndUpdate(user.role, { $inc: { userCount: -1 } });
  }

  sendResponse(res, 200, 'Role assigned to user successfully', updatedUser);
});

// Allows admins to unassign a role from user
export const unassignRoleFromUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  let user = await User.findById(userId);

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (user.role) {
    user = await User.findByIdAndUpdate(userId, { $unset: { role: 1 } }, { new: true });
    await Role.findByIdAndUpdate(user.role, { $inc: { userCount: -1 } });
  }

  sendResponse(res, 200, 'Role unassigned from user successfully', updatedUser);
});

// Allows authorized users to update active status of another user
export const updateActiveStatus = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const userWithUpdatedStatus = await User.findByIdAndUpdate(
    userId,
    { isActive: !user.isActive },
    { runValidators: true, new: true }
  );

  sendResponse(res, 200, 'Active status of a user updated successfully', userWithUpdatedStatus);
});

// Allows authorized users to archive another user
export const archiveUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const archivedUser = await User.findByIdAndUpdate(
    userId,
    { isArchived: true },
    { runValidators: true, new: true }
  );

  if (!archivedUser) {
    throw new CustomError('User not found', 404);
  }

  sendResponse(res, 200, 'User archived successfully', archivedUser);
});

// Allows authorized users to restore an archived user
export const restoreArchivedUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const restoredUser = await User.findByIdAndUpdate(
    userId,
    { isArchived: false },
    { runValidators: true, new: true }
  );

  if (!restoredUser) {
    throw new CustomError('User not found', 404);
  }

  sendResponse(res, 200, 'Archived user restored successfully', restoredUser);
});
