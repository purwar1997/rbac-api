import User from '../models/user.js';
import Role from '../models/role.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/CustomError.js';
import { sendResponse, isOnlyRootUser } from '../utils/helperFunctions.js';
import { clearCookieOptions } from '../utils/cookieOptions.js';
import { uploadImage, deleteImage } from '../services/cloudinaryAPIs.js';
import { getUserSortRule } from '../utils/sortRules.js';
import { FILE_UPLOAD } from '../constants/common.js';

// Allows authenticated users to retrieve their profile
export const getProfile = handleAsync(async (req, res) => {
  const { user } = req;

  sendResponse(res, 200, 'Profile retrieved successfully', user);
});

// Allows authenticated users to update their profile
export const updateProfile = handleAsync(async (req, res) => {
  const updates = req.body;

  if (!updates.password) {
    delete updates.password;
  }

  const userByPhone = await User.findOne({
    phone: updates.phone,
    _id: { $ne: req.user._id },
  });

  if (userByPhone) {
    throw new CustomError(
      'This phone number is linked to another user. Please provide a different phone number',
      409
    );
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    runValidators: true,
    new: true,
  }).populate('role');

  sendResponse(res, 200, 'Profile updated successfully', updatedUser);
});

// Allows authenticated users to delete their account
export const deleteAccount = handleAsync(async (req, res) => {
  const { user } = req;

  if (isOnlyRootUser(user)) {
    throw new CustomError(
      `Currently, you are the only ${user.role.title.toLowerCase()}. Promote another user to the role of ${user.role.title.toLowerCase()} before deleting your account`,
      409
    );
  }

  await User.findByIdAndDelete(user._id);

  if (user.avatar?.publicId) {
    await deleteImage(user.avatar.publicId);
  }

  if (user.role) {
    await Role.findByIdAndUpdate(user.role._id, { $inc: { userCount: -1 } });
  }

  res.clearCookie('token', clearCookieOptions);

  sendResponse(res, 200, 'Account deleted successfully');
});

// Allows authenticated users to add their profile photo
export const addProfilePhoto = handleAsync(async (req, res) => {
  const { user } = req;

  if (user.avatar?.publicId) {
    await deleteImage(user.avatar.publicId);
  }

  const response = await uploadImage(FILE_UPLOAD.FOLDER_NAME, req.file, user._id);

  user.avatar = {
    url: response.secure_url,
    publicId: response.public_id,
  };

  user.role = user.role?._id;
  const updatedUser = await user.save();

  sendResponse(res, 200, 'Profile photo added successfully', updatedUser);
});

// Allows authenticated users to update their profile photo
export const updateProfilePhoto = handleAsync(async (req, res) => {
  const { user } = req;

  if (user.avatar?.publicId) {
    await deleteImage(user.avatar.publicId);
  }

  const response = await uploadImage(FILE_UPLOAD.FOLDER_NAME, req.file, user._id);

  user.avatar = {
    url: response.secure_url,
    publicId: response.public_id,
  };

  user.role = user.role?._id;
  const updatedUser = await user.save();

  sendResponse(res, 200, 'Profile photo updated successfully', updatedUser);
});

// Allows authenticated users to remove their profile photo
export const removeProfilePhoto = handleAsync(async (req, res) => {
  const { user } = req;

  if (!user.avatar?.publicId) {
    throw new CustomError('Profile photo does not exist', 404);
  }

  await deleteImage(user.avatar.publicId);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $unset: { avatar: 1 } },
    { new: true }
  );

  sendResponse(res, 200, 'Profile photo removed successfully', updatedUser);
});

// Allows authenticated users to retrieve a paginated list of other users
export const getUsers = handleAsync(async (req, res) => {
  const { sortBy, order, page, limit } = req.query;
  const sortRule = getUserSortRule(sortBy, order);

  const users = await User.find({
    _id: { $ne: req.user._id },
    isArchived: false,
  })
    .select({
      firstname: 1,
      lastname: 1,
      email: 1,
      role: 1,
      isActive: 1,
      createdAt: 1,
    })
    .sort(sortRule)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('role');

  const userCount = await User.countDocuments({
    _id: { $ne: req.user._id },
    isArchived: false,
  });

  res.set('X-Total-Count', userCount);

  sendResponse(res, 200, 'Users retrieved successfully', users);
});

// Allows authorized users to retrieve a user by ID
export const getUserById = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate('role');

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  sendResponse(res, 200, 'User retrieved by ID successfully', user);
});

// Allows authorized users to assign a role to another user
export const assignRoleToUser = handleAsync(async (req, res) => {
  const { userId } = req.params;
  const { role: roleId } = req.body;

  const user = await User.findById(userId).populate('role');

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const role = await Role.findById(roleId);

  if (!role) {
    throw new CustomError('Provided role does not exist', 404);
  }

  if (user.role?._id.toString() === roleId) {
    throw new CustomError('Provided role has already been assigned to the user', 409);
  }

  if (isOnlyRootUser(user)) {
    throw new CustomError(
      `Currently, this user is the only ${user.role.title.toLowerCase()}. Promote another user to the role of ${user.role.title.toLowerCase()} before assigning new role to this user`,
      409
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role: roleId },
    { runValidators: true, new: true }
  ).populate('role');

  await Role.findByIdAndUpdate(roleId, { $inc: { userCount: 1 } });

  if (user.role) {
    await Role.findByIdAndUpdate(user.role._id, { $inc: { userCount: -1 } });
  }

  updatedUser.role.userCount = updatedUser.role.userCount + 1;
  sendResponse(res, 200, 'Role assigned to user successfully', updatedUser);
});

// Allows authorized users to unassign a role from another user
export const unassignRoleFromUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate('role');

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (!user.role) {
    throw new CustomError('User has not been assigned a role', 409);
  }

  if (isOnlyRootUser(user)) {
    throw new CustomError(
      `Currently, this user is the only ${user.role.title.toLowerCase()}. Promote another user to the role of ${user.role.title.toLowerCase()} before unassigning role from this user`,
      409
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $unset: { role: 1 },
    },
    { new: true }
  );

  await Role.findByIdAndUpdate(user.role._id, { $inc: { userCount: -1 } });

  sendResponse(res, 200, 'Role unassigned from user successfully', updatedUser);
});

// Allows authorized users to activate another user
export const activateUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (user.isActive) {
    throw new CustomError('User is already active', 409);
  }

  user.isActive = true;
  const activeUser = await user.save();

  sendResponse(res, 200, 'User activated successfully', activeUser);
});

// Allows authorized users to deactivate another user
export const deactivateUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate('role');

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (!user.isActive) {
    throw new CustomError('User is already inactive', 409);
  }

  if (isOnlyRootUser(user)) {
    throw new CustomError(
      `Currently, this user is the only ${user.role.title.toLowerCase()}. Promote another user to the role of ${user.role.title.toLowerCase()} before deactivating this user`,
      409
    );
  }

  user.isActive = false;
  user.role = user.role?._id;
  const inactiveUser = await user.save();

  sendResponse(res, 200, 'User deactivated successfully', inactiveUser);
});

// Allows authorized users to archive another user
export const archiveUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate('role');

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (user.isArchived) {
    throw new CustomError('User has already been archived', 409);
  }

  if (isOnlyRootUser(user)) {
    throw new CustomError(
      `Currently, this user is the only ${user.role.title.toLowerCase()}. Promote another user to the role of ${user.role.title.toLowerCase()} before archiving this user`,
      409
    );
  }

  user.isArchived = true;
  user.role = user.role?._id;
  const archivedUser = await user.save();

  sendResponse(res, 200, 'User archived successfully', archivedUser);
});

// Allows authorized users to restore an archived user
export const restoreArchivedUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (!user.isArchived) {
    throw new CustomError('User is not archived, so it cannot be restored', 409);
  }

  user.isArchived = false;
  const restoredUser = await user.save();

  sendResponse(res, 200, 'Archived user restored successfully', restoredUser);
});

// Allows authorized users to delete another user
export const deleteUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate('role');

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (isOnlyRootUser(user)) {
    throw new CustomError(
      `Currently, this user is the only ${user.role.title.toLowerCase()}. Promote another user to the role of ${user.role.title.toLowerCase()} before deleting this user`,
      409
    );
  }

  await User.findByIdAndDelete(userId);

  if (user.avatar?.publicId) {
    await deleteImage(user.avatar.publicId);
  }

  if (user.role) {
    await Role.findByIdAndUpdate(user.role._id, { $inc: { userCount: -1 } });
  }

  sendResponse(res, 200, 'User deleted successfully', userId);
});
