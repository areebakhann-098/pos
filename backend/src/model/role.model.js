import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
 
const Role = sequelize.define('Role', {
  name: { type: DataTypes.STRING, unique: true },
});
 
export default Role;
 