import express from "express";
import {
  createMigration,
  getMigrations,
  getMigrationById,
  updateMigration,
  deleteMigration,
  searchMigrations
} from "../controller/migration.controller.js";
import { verifyToken } from '../middleware/jwt.middleware.js';
import { authorize } from '../middleware/accessControl.middleware.js';


const router = express.Router();

router.post("/migrations", verifyToken, authorize('create', 'product', 'any'),createMigration);
router.get("/migrations", verifyToken, authorize('read', 'product', 'any'),getMigrations);
router.get("/migrations/:id",verifyToken, authorize('read', 'product', 'any'), getMigrationById);
router.put("/migrations/:id", verifyToken, authorize('update', 'product', 'any'),updateMigration);
router.delete("/migrations/:id",verifyToken, authorize('delete', 'product', 'any'), deleteMigration);
router.get("/search-products", verifyToken, authorize('read', 'product||sale', 'any'),searchMigrations);


export default router;
