import Role from '../models/role.js';
import User from '../models/user.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/CustomError.js';
import { hasAllPermissions, sendResponse } from '../utils/helperFunctions.js';
import { getRoleSortRule } from '../utils/sortRules.js';

// Allows authenticated users to retrieve a paginated list of roles
export const getRoles = handleAsync(async (req, res) => {
  const { sortBy, order, page, limit } = req.query;
  const sortRule = sortBy ? getRoleSortRule(sortBy, order) : { createdAt: -1 };

  const roles = await Role.find()
    .select({
      title: 1,
      userCount: 1,
      isActive: 1,
      createdAt: 1,
    })
    .sort(sortRule)
    .skip((page - 1) * limit)
    .limit(limit);

  const roleCount = await Role.countDocuments();

  res.set('X-Total-Count', roleCount);

  sendResponse(res, 200, 'Roles retrieved successfully', roles);
});

// Allows authorized users to retrieve a role by ID
export const getRoleById = handleAsync(async (req, res) => {
  const { roleId } = req.params;

  const role = await Role.findById(roleId);

  if (!role) {
    throw new CustomError('Role not found', 404);
  }

  sendResponse(res, 200, 'Role retrieved by ID successfully', role);
});

// Allows authorized users to add a new role
export const addNewRole = handleAsync(async (req, res) => {
  const { title, permissions } = req.body;

  const roleByTitle = await Role.findOne({ title });

  if (roleByTitle) {
    throw new CustomError(
      'Role by this title already exists. Please provide a different title',
      409
    );
  }

  const roleByPermissions = await Role.findOne({
    permissions: {
      $all: permissions,
      $size: permissions.length,
    },
  });

  if (roleByPermissions) {
    throw new CustomError(
      `${roleByPermissions.title} role with the same permissions already exists. Either use it or provide different permissions`,
      409
    );
  }

  const newRole = await Role.create({
    title,
    permissions: [...new Set(permissions)],
  });

  sendResponse(res, 201, 'Role added successfully', newRole);
});

// Allows authorized users to update an existing role
export const updateRole = handleAsync(async (req, res) => {
  const { roleId } = req.params;
  const { title, permissions } = req.body;

  const role = await Role.findById(roleId);

  if (!role) {
    throw new CustomError('Role not found', 404);
  }

  if (hasAllPermissions(role.permissions) && !hasAllPermissions(permissions)) {
    throw new CustomError(
      'Cannot modify permissions for a role with full administrative access. Only title updates are allowed',
      403
    );
  }

  const roleByTitle = await Role.findOne({ title, _id: { $ne: roleId } });

  if (roleByTitle) {
    throw new CustomError(
      'Role by this title already exists. Please provide a different title',
      409
    );
  }

  const roleByPermissions = await Role.findOne({
    permissions: {
      $all: permissions,
      $size: permissions.length,
    },
    _id: { $ne: roleId },
  });

  if (roleByPermissions) {
    throw new CustomError(
      `${roleByPermissions.title} role with the same permissions already exists. Either use it or provide different permissions`,
      409
    );
  }

  const updatedRole = await Role.findByIdAndUpdate(
    roleId,
    {
      title,
      $addToSet: {
        permissions: { $each: permissions },
      },
    },
    {
      runValidators: true,
      new: true,
    }
  );

  sendResponse(res, 200, 'Role updated successfully', updatedRole);
});

// Allows authorized users to delete a role
export const deleteRole = handleAsync(async (req, res) => {
  const { roleId } = req.params;

  const role = await Role.findById(roleId);

  if (!role) {
    throw new CustomError('Role not found', 404);
  }

  if (hasAllPermissions(role.permissions)) {
    throw new CustomError(
      'Cannot delete a role with full administrative access. This role is required for system administration',
      403
    );
  }

  await Role.findByIdAndDelete(roleId);
  await User.updateMany({ role: roleId }, { $unset: { role: 1 } });

  sendResponse(res, 200, 'Role deleted succesfully', roleId);
});

// Allows authorized users to activate an inactive role
export const activateRole = handleAsync(async (req, res) => {
  const { roleId } = req.params;

  const role = await Role.findById(roleId);

  if (!role) {
    throw new CustomError('Role not found', 404);
  }

  if (role.isActive) {
    throw new CustomError('Role is already active', 409);
  }

  role.isActive = true;
  const activeRole = await role.save();

  sendResponse(res, 200, 'Role activated successfully', activeRole);
});

// Allows authorized users to deactivate an active role
export const deactivateRole = handleAsync(async (req, res) => {
  const { roleId } = req.params;

  const role = await Role.findById(roleId);

  if (!role) {
    throw new CustomError('Role not found', 404);
  }

  if (!role.isActive) {
    throw new CustomError('Role is already inactive', 409);
  }

  if (hasAllPermissions(role.permissions)) {
    throw new CustomError(
      'Cannot deactivate a role with full administrative access. This role is required for system administration',
      403
    );
  }

  role.isActive = false;
  const inactiveRole = await role.save();

  sendResponse(res, 200, 'Role deactivated successfully', inactiveRole);
});
