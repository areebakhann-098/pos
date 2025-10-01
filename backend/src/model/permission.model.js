import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
 
const Permission = sequelize.define('Permission', {
  resource: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING, // create, read, update, delete
    allowNull: false,
  },
  possession: {
    type: DataTypes.STRING, // own, any
    allowNull: false,
  },
  attributes: {
    type: DataTypes.ARRAY(DataTypes.STRING), // e.g. ['*'] or ['name', 'email']
    defaultValue: ['*'],
  }
});
 
export default Permission;