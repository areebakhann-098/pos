import Role from '../model/role.model.js';
import Permission from '../model/permission.model.js';
 
export const createRole = async (req, res) => {
  try {
    const { name, permissionIds } = req.body;
 
    if (!name) {
      return res.status(400).json({ message: 'Role name is required' });
    }
 
    const existing = await Role.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: 'Role already exists' });
    }
 
    let permissions = [];
 
    // Only validate if permissionIds is an array
    if (Array.isArray(permissionIds) && permissionIds.length > 0) {
      // Make sure all IDs are numbers or strings (depending on your DB schema)
      const validIds = permissionIds.map(id => Number(id));
     
      permissions = await Permission.findAll({
        where: {
          id: validIds,
        },
      });
 
      if (permissions.length !== validIds.length) {
        return res.status(400).json({
          message: 'Some permissions not found. Role was not created.',
        });
      }
    }
 
    //  Now that permissions are valid, create role
    const role = await Role.create({ name });
 
    if (permissions.length > 0) {
      await role.setPermissions(permissions);
    }
 
    return res.status(201).json({ message: 'Role created successfully', role });
  } catch (error) {
    console.error('Create Role Error:', error);
    return res.status(500).json({ message: 'Failed to create role' });
  }
};
 
// ✅ Get all roles with permissions
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] },
        },
      ],
    });
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error.message);
    res.status(500).json({ message: 'Failed to fetch roles' });
  }
};
 
// Update role by ID
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
 
    if (!name) {
      return res.status(400).json({ message: 'Updated role name is required' });
    }
 
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
 
    role.name = name;
    await role.save();
 
    res.status(200).json({ message: 'Role updated successfully', role });
  } catch (error) {
    console.error('Error updating role:', error.message);
    res.status(500).json({ message: 'Failed to update role' });
  }
};
 
// Delete role by ID
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
 
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
 
    await role.destroy();
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error.message);
    res.status(500).json({ message: 'Failed to delete role' });
  }
};