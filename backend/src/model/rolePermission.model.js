import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
 
const RolePermission = sequelize.define('role_permissions', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true 
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  permissionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
});
 
export default RolePermission;