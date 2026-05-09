// Centralized auth and role/permission utilities

export const ROLES = {
  ADMIN: 'admin',
  WRITER: 'writer',
};

export const DEFAULT_PERMISSIONS = {
  [ROLES.ADMIN]: {
    manageUsers: true,
    editPosts: true,
    publishPosts: true,
  },
  [ROLES.WRITER]: {
    manageUsers: false,
    editPosts: true,
    publishPosts: false,
  },
};

/**
 * Check if a user has a specific permission
 * @param {Object} user - The user object from Firestore
 * @param {string} permission - The permission key to check
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.active) return false;
  if (!user.permissions) return false;
  return !!user.permissions[permission];
};

/**
 * Check if a user is an admin
 * @param {Object} user - The user object from Firestore
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return user?.role === ROLES.ADMIN && user?.active;
};

/**
 * Check if a user can manage users
 * @param {Object} user - The user object from Firestore
 * @returns {boolean}
 */
export const canManageUsers = (user) => {
  return hasPermission(user, 'manageUsers');
};
