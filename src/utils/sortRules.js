import { USER_SORT_OPTIONS, ROLE_SORT_OPTIONS, SORT_ORDER } from '../constants/sortOptions.js';

export const getUserSortRule = (sortBy, order) => {
  switch (sortBy) {
    case USER_SORT_OPTIONS.NAME: {
      return {
        firstname: order === SORT_ORDER.ASCENDING ? 1 : -1,
        lastname: order === SORT_ORDER.ASCENDING ? 1 : -1,
      };
    }

    case USER_SORT_OPTIONS.CREATED_AT: {
      return {
        createdAt: order === SORT_ORDER.ASCENDING ? 1 : -1,
      };
    }

    default:
      return {};
  }
};

export const getRoleSortRule = (sortBy, order) => {
  switch (sortBy) {
    case ROLE_SORT_OPTIONS.USER_COUNT: {
      return {
        userCount: order === SORT_ORDER.ASCENDING ? 1 : -1,
      };
    }

    case ROLE_SORT_OPTIONS.CREATED_AT: {
      return {
        createdAt: order === SORT_ORDER.ASCENDING ? 1 : -1,
      };
    }

    default:
      return {};
  }
};
