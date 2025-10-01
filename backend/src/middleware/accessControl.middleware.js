import { buildAccessControlFromDB } from '../utils/accessControlRolePermission.util.js';
export const authorize = (action, resource, possession) => {
  return async (req, res, next) => {
    console.log(' Authorize middleware called');
 
    // Step 1: get user role
 const role = req.user?.roles?.[0] || req.body?.role || 'guest';
     console.log('Role from request:', role);
 
      // Step 2: If admin, skip permission checks
    if (role === 'admin') {
      console.log(' Admin detected — full access granted');
      return next(); // Skip all checks for admin
    }
 
    // Step 2: build access control from DB
    const accessControl = await buildAccessControlFromDB();
    console.log(' Access Control Object:', accessControl);
 
    // Step 3: extract permissions for this role
    const rolePermissions = accessControl[role] || [];
    console.log(' Permissions for role:', role, rolePermissions);
 
    // Step 4: match permission
    console.log(' Checking permission for:', action, resource, possession);
 
    const isAllowed = rolePermissions.some((perm) => {
      console.log(' Checking permission:', perm);
      return (
        perm.resource === resource &&
        perm.action === action &&
        perm.possession === possession
      );
    });
 
    // Step 5: result
    if (!isAllowed) {
      console.log(' Access denied for role:', role);
      return res.status(403).json({ message: 'Access Denied' });
    }
 
    console.log(' Access granted');
    next();
  };
};