export const STORAGE = Object.freeze({
  DATABASE_NAME: 'rbac_system',
});

export const JWT = Object.freeze({
  EXPIRY: '24h',
});

export const REGEX = Object.freeze({
  NAME: /^[A-Za-z\s]*$/,
  EMAIL: /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /(0|91)?[6-9][0-9]{9}/,
  PASSWORD: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*_])[a-zA-Z0-9!@#$%^&*_]{6,20}$/,
  IMAGE_URL: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/,
});

export const PERMISSIONS = Object.freeze({
  VIEW_USER: 'view_user',
  ARCHIVE_USER: 'archive_user',
  RESTORE_USER: 'restore_user',
  UPDATE_STATUS: 'update_status',
  VIEW_ROLE: 'view_role',
  ADD_ROLE: 'add_role',
  EDIT_ROLE: 'edit_role',
  ASSIGN_ROLE: 'assign_role',
  UNASSIGN_ROLE: 'unassign_role',
});

export const PERMISSIONS_DESCRIPTION = Object.freeze({
  [PERMISSIONS.VIEW_USER]: 'View a user',
  [PERMISSIONS.ARCHIVE_USER]: 'Archive a user',
  [PERMISSIONS.RESTORE_USER]: 'Restore an archived user',
  [PERMISSIONS.UPDATE_STATUS]: 'Update an active status of a user',
  [PERMISSIONS.VIEW_ROLE]: 'View a role',
  [PERMISSIONS.ADD_ROLE]: 'Add a new role',
  [PERMISSIONS.EDIT_ROLE]: 'Edit a role',
  [PERMISSIONS.ASSIGN_ROLE]: 'Assign role to the user',
  [PERMISSIONS.UNASSIGN_ROLE]: 'Unassign role from the user',
});
