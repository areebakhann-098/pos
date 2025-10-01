import UserRole from '../model/userRole.model.js';
import User from '../model/user.model.js';
import Role from '../model/role.model.js';
 
//  Create - Assign role to user
export const assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;
 
    if (!userId || !roleId) {
      return res.status(400).json({ message: 'userId and roleId are required' });
    }
    // Check if user and role exist
    const user = await User.findByPk(userId);
    const role = await Role.findByPk(roleId);
 
    if (!user || !role) {
      return res.status(404).json({ message: 'User or Role not found' });
    }
 
    // Avoid duplicate mapping
    const existing = await UserRole.findOne({ where: { userId, roleId } });
    if (existing) {
      return res.status(409).json({ message: 'Role already assigned to this user' });
    }
 
    const userRole = await UserRole.create({ userId, roleId });
  if (userRole) {
      user.access = true;
      await user.save(); // Save updated access field
    }
 
 
    res.status(201).json({ message: 'Role assigned to user successfully', userRole });
  } catch (error) {
    console.error('Assign Error:', error.message);
    res.status(500).json({ message: 'Failed to assign role to user' });
  }
};
 
//  Read - Get all user-role mappings
export const getAllUserRoles = async (req, res) => {
  try {
    const mappings = await UserRole.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Role, attributes: ['id', 'name'] }
      ]
    });
    res.status(200).json(mappings);
  } catch (error) {
    console.error('Fetch Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch user-role mappings' });
  }
};
 
//  Update - Update mapping (change user or role)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, roleId } = req.body;
 
    const mapping = await UserRole.findByPk(id);
    if (!mapping) {
      return res.status(404).json({ message: 'Mapping not found' });
    }
 
    // Optional: prevent duplicate after update
    if (userId && roleId) {
      const duplicate = await UserRole.findOne({
        where: { userId, roleId }
      });
      if (duplicate && duplicate.id !== parseInt(id)) {
        return res.status(409).json({ message: 'This mapping already exists' });
      }
    }
 
    if (userId) mapping.userId = userId;
    if (roleId) mapping.roleId = roleId;
 
    await mapping.save();
    res.status(200).json({ message: 'User-role mapping updated successfully', mapping });
  } catch (error) {
    console.error('Update Error:', error.message);
    res.status(500).json({ message: 'Failed to update user-role mapping' });
  }
};
 
//  Delete - Remove a user-role mapping
export const deleteUserRole = async (req, res) => {
  try {
    const { id } = req.params;
 
    const mapping = await UserRole.findByPk(id);
    if (!mapping) {
      return res.status(404).json({ message: 'Mapping not found' });
    }
 
    await mapping.destroy();
    res.status(200).json({ message: 'User-role mapping deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error.message);
    res.status(500).json({ message: 'Failed to delete user-role mapping' });
  }
};