import Role from '../model/role.model.js';
import Permission from '../model/permission.model.js';
import RolePermission from '../model/rolePermission.model.js';

export const buildAccessControlFromDB = async () => {
  const accessControl = {};

  // 🔍 Find all entries from RolePermission with Role & Permission included
  const rolePermissions = await RolePermission.findAll({
    include: [
      {
        model: Role,
        as: 'role',
        attributes: ['name'],
      },
      {
        model: Permission,
        as: 'permission',
        attributes: ['resource', 'action', 'possession'],
      },
    ],
  });

  for (const rp of rolePermissions) {
    const roleName = rp.role.name;
    const { resource, action, possession } = rp.permission;

    if (!accessControl[roleName]) {
      accessControl[roleName] = [];
    }

    accessControl[roleName].push({ resource, action, possession });
  }

  return accessControl;
};
