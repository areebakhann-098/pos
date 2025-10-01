import Permission from '../model/permission.model.js';
 
// Create new permission
export const createPermission = async (req, res) => {
  try {
    const { resource, action, possession, attributes } = req.body;
 
    if (!resource || !action || !possession) {
      return res.status(400).json({ message: 'resource, action, and possession are required' });
    }
 
    const permission = await Permission.create({
      resource,
      action,
      possession,
      attributes: attributes || ['*'],
    });
 
    res.status(201).json({ message: 'Permission created successfully', permission });
  } catch (error) {
    console.error('Error creating permission:', error.message);
    res.status(500).json({ message: 'Failed to create permission' });
  }
};
 
// Get all permissions
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.status(200).json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error.message);
    res.status(500).json({ message: 'Failed to fetch permissions' });
  }
};
 
// Update permission by ID
export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { resource, action, possession, attributes } = req.body;
 
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }
 
    // Update only provided fields
    if (resource) permission.resource = resource;
    if (action) permission.action = action;
    if (possession) permission.possession = possession;
    if (attributes) permission.attributes = attributes;
 
    await permission.save();
 
    res.status(200).json({ message: 'Permission updated successfully', permission });
  } catch (error) {
    console.error('Error updating permission:', error.message);
    res.status(500).json({ message: 'Failed to update permission' });
  }
};
 
// Delete permission by ID
export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
 
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }
 
    await permission.destroy();
    res.status(200).json({ message: 'Permission deleted successfully' });
  } catch (error) {
    console.error('Error deleting permission:', error.message);
    res.status(500).json({ message: 'Failed to delete permission' });
  }
 
};
// Get single permission by ID
export const getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;
 
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }
 
    res.status(200).json(permission);
  } catch (error) {
    console.error('Error fetching permission:', error.message);
    res.status(500).json({ message: 'Failed to fetch permission' });
  }
};
 
export const getAllResources = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      attributes: ['resource'],
      group: ['resource'],
    });
 
    const uniqueResources = permissions.map(p => p.resource);
    res.status(200).json(uniqueResources);
  } catch (error) {
    console.error('Error fetching resources:', error.message);
    res.status(500).json({ message: 'Failed to fetch resources' });
  }
};