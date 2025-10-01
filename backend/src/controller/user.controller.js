import User from '../model/user.model.js';
import Role from '../model/role.model.js';
import UserRole from '../model/userRole.model.js';
import bcrypt from 'bcryptjs';
// Get all users with their roles
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Role,
        as: 'roles',
        attributes: ['id', 'name'],
        through: { attributes: [] },
      },
    });
    res.status(200).json(users);
  } catch (err) {
    console.error('Fetch Error:', err.message);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Get single user with roles
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: {
        model: Role,
        as: 'roles',
        attributes: ['id', 'name'],
        through: { attributes: [] },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Fetch Error:', err.message);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
};

// Create new user with role
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('📥 Incoming Request Body:', req.body);

    // 🔍 Check required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: 'name, email, password, and role are required'
      });
    }

    // 🔍 Check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // 🔍 Find role by name (string)
    const roleInstance = await Role.findOne({ where: { name: role } });
    if (!roleInstance) {
      return res.status(404).json({ message: `Role '${role}' not found` });
    }

    // 🔐 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // ✅ Create user and assign role
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      access: true
    });

    await user.setRoles([roleInstance]); // Sequelize handles pivot insertion

    // ✅ Respond with user and assigned role name
    res.status(201).json({
      message: 'User created and role assigned successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleInstance.name
      }
    });
  } catch (err) {
    console.error('Create Error:', err.message);
    res.status(500).json({ message: 'Failed to create user' });
  }
};
// Update user and role
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findByPk(id, {
      include: { model: Role, as: 'roles' }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 🔍 Email uniqueness check
    if (email && email !== user.email) {
      const duplicate = await User.findOne({ where: { email } });
      if (duplicate) {
        return res.status(409).json({ message: 'Email is already used by another user' });
      }
    }

    // ✅ Update allowed fields (excluding password)
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    // 🔁 Update role if provided (string)
    if (role) {
      const roleInstance = await Role.findOne({ where: { name: role } });
      if (!roleInstance) {
        return res.status(404).json({ message: `Role '${role}' not found` });
      }

      await user.setRoles([roleInstance]);
      user.access = true;
      await user.save();
    }

    // ✅ Final response
    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role || (user.roles[0]?.name || null)
      }
    });
  } catch (err) {
    console.error('Update Error:', err.message);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// Delete user and role mappings
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.setRoles([]); // remove associations
    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err.message);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
