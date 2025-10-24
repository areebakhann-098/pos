import Role from '../model/role.model.js';
import Permission from '../model/permission.model.js';

// ✅ Create Role
export const createRole = async (req, res) => {
  try {
    console.log('📥 Incoming Role Create Request:', req.body);

    const { name, permissionIds } = req.body;

    if (!name) {
      console.warn('⚠️ Missing role name!');
      return res.status(400).json({ message: 'Role name is required' });
    }

    // 🔍 Check if role already exists
    const existing = await Role.findOne({ where: { name } });
    if (existing) {
      console.warn('⚠️ Role already exists:', name);
      return res.status(409).json({ message: 'Role already exists' });
    }

    let permissions = [];

    // ✅ Validate permission IDs
    if (Array.isArray(permissionIds) && permissionIds.length > 0) {
      console.log('🔗 Validating permission IDs:', permissionIds);

      const validIds = permissionIds.map((id) => Number(id));
      permissions = await Permission.findAll({ where: { id: validIds } });

      console.log('✅ Found Permissions:', permissions.map((p) => p.id));

      if (permissions.length !== validIds.length) {
        console.error('❌ Some permission IDs not found in DB');
        return res.status(400).json({
          message: 'Some permissions not found. Role was not created.',
        });
      }
    }

    // ✅ Create Role
    const role = await Role.create({ name });
    console.log('🟢 Role Created:', role.id, role.name);

    // ✅ Link Permissions (if any)
    if (permissions.length > 0) {
      await role.setPermissions(permissions);
      console.log(`🔗 Linked ${permissions.length} permissions to role #${role.id}`);
    }

    return res.status(201).json({
      message: 'Role created successfully',
      role,
    });
  } catch (error) {
    console.error('❌ Create Role Error:', error);
    return res.status(500).json({ message: 'Failed to create role', error: error.message });
  }
};

// ✅ Get All Roles
export const getAllRoles = async (req, res) => {
  try {
    console.log('📡 Fetching all roles...');
    const roles = await Role.findAll({
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] },
        },
      ],
    });

    console.log(`✅ Fetched ${roles.length} roles`);
    res.status(200).json(roles);
  } catch (error) {
    console.error('❌ Error fetching roles:', error.message);
    res.status(500).json({ message: 'Failed to fetch roles', error: error.message });
  }
};

// ✅ Update Role + Permissions
export const updateRole = async (req, res) => {
  try {
    console.log('🟡 Update Role Request:', req.params, req.body);

    const { id } = req.params;
    const { name, permissionIds } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Updated role name is required' });
    }

    // 🔍 Find role by ID
    const role = await Role.findByPk(id, {
      include: [{ model: Permission, as: 'permissions' }],
    });

    if (!role) {
      console.warn('⚠️ Role not found for ID:', id);
      return res.status(404).json({ message: 'Role not found' });
    }

    // ✏️ Update role name
    role.name = name;
    await role.save();
    console.log(`✅ Role name updated to '${name}'`);

    // 🔁 Update permissions (if provided)
    if (Array.isArray(permissionIds)) {
      console.log('🔗 Updating permissions for role:', permissionIds);

      const permissions = await Permission.findAll({
        where: { id: permissionIds },
      });

      // Replace existing permissions with new ones
      await role.setPermissions(permissions);
      console.log(`✅ Role #${id} permissions updated successfully`);
    }

    // 🔙 Return updated role with permissions
    const updatedRole = await Role.findByPk(id, {
      include: [{ model: Permission, as: 'permissions' }],
    });

    return res.status(200).json({
      message: 'Role and permissions updated successfully',
      role: updatedRole,
    });
  } catch (error) {
    console.error('❌ Error updating role:', error);
    res.status(500).json({
      message: 'Failed to update role',
      error: error.message,
    });
  }
};


// ✅ Delete Role
export const deleteRole = async (req, res) => {
  try {
    console.log('🔴 Delete Role Request:', req.params);
    const { id } = req.params;

    const role = await Role.findByPk(id);
    if (!role) {
      console.warn('⚠️ Role not found for ID:', id);
      return res.status(404).json({ message: 'Role not found' });
    }

    await role.destroy();
    console.log('🗑️ Role deleted:', id);

    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting role:', error.message);
    res.status(500).json({ message: 'Failed to delete role', error: error.message });
  }
};
export const getRoleById = async (req, res) => {
  try {
    const roleId = req.params.id;
    const role = await Role.findByPk(roleId, {
      include: ['permissions'], // ✅ or adjust based on your ORM
    });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json(role);
  } catch (error) {
    console.error('❌ Error fetching role by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
