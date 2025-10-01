import express from "express";
import {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
} from "../controller/unit.controller.js";

const router = express.Router();

// ✅ Explicit route names
router.post("/units/create", createUnit);          // POST   /api/units/create
router.get("/units/list", getAllUnits);            // GET    /api/units/list
router.get("/units/list/:id", getUnitById);      // GET    /api/units/detail/:id
router.put("/units/update/:id", updateUnit);       // PUT    /api/units/update/:id
router.delete("/units/delete/:id", deleteUnit);    // DELETE /api/units/delete/:id

export default router;
