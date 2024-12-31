import { deepFreeze } from '../utils/helperFunctions.js';

export const STORAGE = Object.freeze({
  DATABASE_NAME: 'rbac_system',
  CLOUD_NAME: 'dlqnx5pot',
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

export const PERMISSIONS = deepFreeze({
  USER: {
    VIEW: 'view_user',
    ACTIVATE: 'activate_user',
    DEACTIVATE: 'deactivate_user',
    ARCHIVE: 'archive_user',
    RESTORE: 'restore_user',
    DELETE: 'delete_user',
  },
  ROLE: {
    VIEW: 'view_role',
    ADD: 'add_role',
    UPDATE: 'update_role',
    DELETE: 'delete_role',
    ASSIGN: 'assign_role',
    UNASSIGN: 'unassign_role',
    ACTIVATE: 'activate_role',
    DEACTIVATE: 'deactivate_role',
  },
});

export const PERMISSIONS_DESCRIPTION = Object.freeze({
  [PERMISSIONS.USER.VIEW]: 'View a user',
  [PERMISSIONS.USER.ACTIVATE]: 'Activate a user',
  [PERMISSIONS.USER.DEACTIVATE]: 'Deactivate a user',
  [PERMISSIONS.USER.ARCHIVE]: 'Archive a user',
  [PERMISSIONS.USER.RESTORE]: 'Restore an archived user',
  [PERMISSIONS.USER.DELETE]: 'Delete a user',
  [PERMISSIONS.ROLE.VIEW]: 'View a role',
  [PERMISSIONS.ROLE.ADD]: 'Add a new role',
  [PERMISSIONS.ROLE.UPDATE]: 'Update a role',
  [PERMISSIONS.ROLE.DELETE]: 'Delete a role',
  [PERMISSIONS.ROLE.ASSIGN]: 'Assign role to the user',
  [PERMISSIONS.ROLE.UNASSIGN]: 'Unassign role from the user',
  [PERMISSIONS.ROLE.ACTIVATE]: 'Activate a role',
  [PERMISSIONS.ROLE.DEACTIVATE]: 'Deactivate a role',
});

export const FILE_UPLOAD = Object.freeze({
  FOLDER_NAME: 'user-avatars',
  FILE_NAME: 'avatar',
  MAX_FILES: 1,
  MAX_FILE_SIZE: 20 * 1024 * 1024,
});
