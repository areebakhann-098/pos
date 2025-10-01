import User from './user.model.js';
import Role from './role.model.js';
import Permission from './permission.model.js';
import UserRole from './userRole.model.js';
import RolePermission from './rolePermission.model.js';
 
//  User ↔ Role (Many-to-Many)
export const defineUserRoleRelation = () => {
    User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'userId',
    otherKey: 'roleId',
    as: 'roles'
  });
 
  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: 'roleId',
    otherKey: 'userId',
    as: 'users'
  });
 
  //  This part is needed for UserRole.findAll({ include: [User, Role] })
  UserRole.belongsTo(User, { foreignKey: 'userId' });
  UserRole.belongsTo(Role, { foreignKey: 'roleId' });
};
 
// Role ↔ Permission (Many-to-Many)
export const defineRolePermissionRelation = () => {
  Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: 'roleId',
    otherKey: 'permissionId',
    as: 'permissions',
  });
 
  Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: 'permissionId',
    otherKey: 'roleId',
    as: 'roles',
  });
 
  // Pivot → Role
  RolePermission.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role',
  });
 
  // Pivot → Permission
  RolePermission.belongsTo(Permission, {
    foreignKey: 'permissionId',
    as: 'permission',
  });
};
 
 
export {
  User,
  Role,
  Permission,
  UserRole,
  RolePermission
};
 