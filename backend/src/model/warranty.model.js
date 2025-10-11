import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Warranty = sequelize.define('Warranty', {
  
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  duration_type: {
    type: DataTypes.ENUM('days', 'months', 'years'),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
}, {
  sequelize,
  modelName: 'Warranties',
  tableName: 'warranties',
  timestamps: true,          // Sequelize will handle createdAt & updatedAt
   paranoid: true, // ✅ soft delete
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Warranty;
