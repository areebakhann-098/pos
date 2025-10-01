import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
 
dotenv.config();
 
export const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false, // optional: turn off SQL logs
});
 
export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log(' PostgreSQL connected successfully.');
 
    await sequelize.sync({ alter: true }); // ensures all tables are kept in sync
    console.log(' All models synchronized.');
  } catch (err) {
    console.error(' Unable to connect to the database:', err.message);
  }
};
 