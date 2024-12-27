import User from '../models/user.js';
import Role from '../models/role.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/CustomError.js';
import { sendResponse, isOnlyRootUser } from '../utils/helperFunctions.js';
import { clearCookieOptions } from '../utils/cookieOptions.js';
import { uploadImage, deleteImage } from '../services/cloudinaryAPIs.js';
import { FILE_UPLOAD } from '../constants/index.js';

// Allows authenticated users to retrieve their profile
export const getUserProfile = handleAsync(async (req, res) => {
  const { user } = req;

  sendResponse(res, 200, 'Profile retrieved successfully', user);
});

// Allows authenticated users to update their profile
export const updateUserProfile = handleAsync(async (req, res) => {
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
    throw new CustomError('Profile photo already exists', 409);
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

// Allows authenticated users to retrieve a list of other users
export const getUsers = handleAsync(async (req, res) => {
  const users = await User.find({
    isArchived: false,
    _id: { $ne: req.user._id },
  })
    .select({
      fullname: 1,
      email: 1,
      phone: 1,
      role: 1,
      isActive: 1,
    })
    .populate('role');

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

  if (isOnlyRootUser(user) && user.role._id.toString() !== roleId) {
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
    throw new CustomError('User does not have any role', 409);
  }

  if (isOnlyRootUser(user)) {
    throw new CustomError(
      `Currently, this user is the only ${user.role.title.toLowerCase()}. Promote another user to the role of ${user.role.title.toLowerCase()} before unassigning role from this user`,
      409
    );
  }

  user.role = undefined;
  const updatedUser = await user.save();

  await Role.findByIdAndUpdate(user.role._id, { $inc: { userCount: -1 } });

  sendResponse(res, 200, 'Role unassigned from user successfully', updatedUser);
});

// Allows authorized users to activate another user
export const activateUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const activeUser = await User.findByIdAndUpdate(
    userId,
    { isActive: true },
    { runValidators: true, new: true }
  );

  if (!activeUser) {
    throw new CustomError('User not found', 404);
  }

  sendResponse(res, 200, 'User activated successfully', activeUser);
});

// Allows authorized users to deactivate another user
export const deactivateUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate('role');

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (isOnlyRootUser(user)) {
    throw new CustomError(
      `Currently, this user is the only ${user.role.title.toLowerCase()}. Promote another user to the role of ${user.role.title.toLowerCase()} before deactivating this user`,
      409
    );
  }

  const inactiveUser = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { runValidators: true, new: true }
  );

  sendResponse(res, 200, 'User deactivated successfully', inactiveUser);
});

// Allows authorized users to archive another user
export const archiveUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate('role');

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (isOnlyRootUser(user)) {
    throw new CustomError(
      `Currently, this user is the only ${user.role.title.toLowerCase()}. Promote another user to the role of ${user.role.title.toLowerCase()} before archiving this user`,
      409
    );
  }

  const archivedUser = await User.findByIdAndUpdate(
    userId,
    { isArchived: true },
    { runValidators: true, new: true }
  );

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
