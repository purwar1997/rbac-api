import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/CustomError.js';
import { PERMISSIONS } from '../constants/index.js';

const SELF_ACTION_ERROR_MESSAGES = Object.freeze({
  [PERMISSIONS.ROLE.ASSIGN]:
    'You cannot assign a role to yourself. This action can only be performed by other users',
  [PERMISSIONS.ROLE.UNASSIGN]:
    'You cannot unassign your own role. This action can only be performed by other users',
  [PERMISSIONS.USER.ACTIVATE]:
    'You cannot activate yourself. This action can only be performed by other users',
  [PERMISSIONS.USER.DEACTIVATE]:
    'You cannot deactivate yourself. This action can only be performed by other users',
  [PERMISSIONS.USER.ARCHIVE]:
    'You cannot archive yourself. This action can only be performed by other users',
  [PERMISSIONS.USER.RESTORE]:
    'You cannot restore yourself. This action can only be performed by other users',
  [PERMISSIONS.USER.DELETE]:
    'You cannot delete yourself. This action can only be performed by other users',
});

export const checkUserSelfAction = actionType =>
  handleAsync((req, _res, next) => {
    const loggedInUserId = req.user._id.toString();

    if (loggedInUserId === req.params.userId) {
      throw new CustomError(SELF_ACTION_ERROR_MESSAGES[actionType], 403);
    }

    next();
  });
