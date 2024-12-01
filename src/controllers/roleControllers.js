import Role from '../models/role.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/CustomError.js';
import { sendResponse } from '../utils/helperFunctions.js';

// Allows authenticated users to retrieve a list of all roles
export const getAllRoles = handleAsync(async (_req, res) => {
  const roles = await Role.find().select({
    title: 1,
    userCount: 1,
    createdAt: 1,
  });

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

  const roleByPermissions = await Role.findOne({ permissions: { $eq: permissions } });

  if (roleByPermissions) {
    throw new CustomError(
      `${roleByPermissions.title} role by these same permissions already exists. Either use it or provide different permissions`,
      409
    );
  }

  const newRole = await Role.create(req.body);

  sendResponse(res, 201, 'Role added successfully', newRole);
});

// Allows authorized users to update an existing role
export const editRole = handleAsync(async (req, res) => {
  const { roleId } = req.params;
  const { title, permissions } = req.body;

  const role = await Role.findById(roleId);

  if (!role) {
    throw new CustomError('Role not found', 404);
  }

  const roleByTitle = await Role.findOne({ title, _id: { $ne: roleId } });

  if (roleByTitle) {
    throw new CustomError(
      'Role by this title already exists. Please provide a different title',
      409
    );
  }

  const roleByPermissions = await Role.findOne({ permissions: { $eq: permissions } });

  if (roleByPermissions) {
    throw new CustomError(
      `${roleByPermissions.title} role by these same permissions already exists. Either use it or provide different permissions`,
      409
    );
  }

  const updatedRole = await Role.findByIdAndUpdate(roleId, req.body, {
    runValidators: true,
    new: true,
  });

  sendResponse(res, 200, 'Role updated successfully', updatedRole);
});
