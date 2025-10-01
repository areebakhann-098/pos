import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
 
const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
 
});
 
export default Product;