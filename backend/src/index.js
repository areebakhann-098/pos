import {app} from './app.js';
import { connectDb } from './config/db.js';
import dotenv from 'dotenv';
 
// ✅ IMPORT association setup BEFORE db connect
import {
  defineUserRoleRelation,
  defineRolePermissionRelation,
} from './model/associations.js';
 import {defineMigrationAssociations} from "./model/migration.associations.js"
import { defineAssociations, defineSaleAssociations } from "./model/pos.association.js";

dotenv.config();
 
const PORT = process.env.PORT || 8000;
 
const startServer = async () => {
  // ✅ Set up model relationships
  defineUserRoleRelation();
  defineRolePermissionRelation();
  defineMigrationAssociations();
  defineAssociations();
  defineSaleAssociations()

 
  // ✅ Then connect DB (sync will now include associations)
  await connectDb();
 
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};
 
startServer();
 