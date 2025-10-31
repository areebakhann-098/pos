import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
 
const Permission = sequelize.define('Permission', {
  resource: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  possession: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  attributes: {
    type: DataTypes.ARRAY(DataTypes.STRING), 
    defaultValue: ['*'],
  }
});
 
export default Permission;