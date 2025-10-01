import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../model/user.model.js';
 import Role from '../model/role.model.js';
import Permission from '../model/permission.model.js';
// Register Controller
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // ✅ Validate Required Fields
  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, email, and password are required',
    });
  }

  // ✅ Validate Email Format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: 'Invalid email format',
    });
  }

  // ✅ Validate Password Length
  if (password.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters',
    });
  }

  try {
    // ✅ Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        message: 'Email is already registered. Please login or use another email.',
      });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    return res.status(500).json({
      message: 'Internal server error. Please try again later.',
    });
  }
};

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;
 
  try {
    const user = await User.findOne({
      where: { email },
      include: {
        model: Role,
        as: 'roles',
        attributes: ['name'],
        through: { attributes: [] },
        include: [
          {
            model: Permission,
            as: 'permissions',
            attributes: ['resource', 'action', 'possession', 'attributes'],
            through: { attributes: [] }
          }
        ]
      }
    });
 
    const isMatch = user && (await bcrypt.compare(password, user.password));
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
 
    if (!user.access) {
      return res.status(403).json({ message: 'Your account is not yet approved for access.' });
    }
 
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
 
    const role = user.roles?.[0];
    const roleName = role?.name || null;
 
    const permissions = role?.permissions?.map(p => ({
      resource: p.resource,
      action: p.action,
      possession: p.possession,
      attributes: p.attributes
    })) || [];
 
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
        role: roleName,
        permissions
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};