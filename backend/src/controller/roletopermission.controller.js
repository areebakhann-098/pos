import RolePermission from '../model/rolePermission.model.js';
import Role from '../model/role.model.js';
import Permission from '../model/permission.model.js';
 
// Create - Assign a permission to a role
export const assignPermissionToRole = async (req, res) => {
  try {
    const { roleId, permissionId } = req.body;
 
    if (!roleId || !permissionId) {
      return res.status(400).json({ message: 'roleId and permissionId are required' });
    }
 
    const role = await Role.findByPk(roleId);
    const permission = await Permission.findByPk(permissionId);
 
    if (!role || !permission) {
      return res.status(404).json({ message: 'Role or Permission not found' });
    }
 
    const rolePermission = await RolePermission.create({ roleId, permissionId });
 
    res.status(201).json({ message: 'Permission assigned to role successfully', rolePermission });
  } catch (error) {
    console.error('Error assigning permission to role:', error.message);
    res.status(500).json({ message: 'Failed to assign permission to role' });
  }
};
 
//  Read - Get all role-permission mappings
export const getAllRolePermissions = async (req, res) => {
  try {
    const all = await RolePermission.findAll({
      include: [
        { model: Role, as: 'role' },
        { model: Permission, as: 'permission' }
      ]
    });
    res.status(200).json(all);
  } catch (error) {
    console.error('Error fetching role permissions:', error.message);
    res.status(500).json({ message: 'Failed to fetch role permissions' });
  }
};
 
//  Update - Update role or permission in a mapping
export const updateRolePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleId, permissionId } = req.body;
 
    const rolePermission = await RolePermission.findByPk(id);
    if (!rolePermission) {
      return res.status(404).json({ message: 'Mapping not found' });
    }
 
    if (roleId) rolePermission.roleId = roleId;
    if (permissionId) rolePermission.permissionId = permissionId;
 
    await rolePermission.save();
    res.status(200).json({ message: 'Mapping updated successfully', rolePermission });
  } catch (error) {
    console.error('Error updating role permission:', error.message);
    res.status(500).json({ message: 'Failed to update role permission' });
  }
};
 
// Delete - Remove a role-permission mapping
export const deleteRolePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const rolePermission = await RolePermission.findByPk(id);
 
    if (!rolePermission) {
      return res.status(404).json({ message: 'Mapping not found' });
    }
 
    await rolePermission.destroy();
    res.status(200).json({ message: 'Mapping deleted successfully' });
  } catch (error) {
    console.error('Error deleting role permission:', error.message);
    res.status(500).json({ message: 'Failed to delete role permission' });
  }
};