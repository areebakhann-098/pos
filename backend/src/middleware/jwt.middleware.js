import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
import UserRole from '../model/userRole.model.js';
import Role from '../model/role.model.js';
 
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
 
    const token = authHeader.split(' ')[1];
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
 
    // 🔥 Actual Role fetch from UserRole -> Role
    const userRoles = await UserRole.findAll({
      where: { userId: user.id },
    });
 
    const roleIds = userRoles.map(ur => ur.roleId);
 
    const rolesData = await Role.findAll({
      where: { id: roleIds },
      attributes: ['name'],
    });
 
    const roles = rolesData.map(r => r.name);
 
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles, // e.g. ['admin', 'viewer']
    };
 
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};