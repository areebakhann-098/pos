import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
 
const UserRole = sequelize.define('user_roles', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});
 
export default UserRole;