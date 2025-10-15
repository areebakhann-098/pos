import express from "express";
import {
  createMigration,
  getMigrations,
  getMigrationById,
  updateMigration,
  deleteMigration,
  searchMigrations
} from "../controller/migration.controller.js";

const router = express.Router();

router.post("/migrations", createMigration);
router.get("/migrations", getMigrations);
router.get("/migrations/:id", getMigrationById);
router.put("/migrations/:id", updateMigration);
router.delete("/migrations/:id", deleteMigration);
router.get("/search-products", searchMigrations);


export default router;
