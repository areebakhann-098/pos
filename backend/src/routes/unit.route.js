import express from "express";
import {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
} from "../controller/unit.controller.js";
import { verifyToken } from '../middleware/jwt.middleware.js';
import { authorize } from '../middleware/accessControl.middleware.js';
const router = express.Router();

//  Explicit route names
router.post("/units/create",verifyToken,authorize('create', 'product', 'any'), createUnit);          // POST   /api/units/create
router.get("/units/list",verifyToken,authorize('read', 'sale||product', 'any'), getAllUnits);            // GET    /api/units/list
router.get("/units/list/:id",verifyToken,authorize('read', 'sale||product', 'any'), getUnitById);      // GET    /api/units/detail/:id
router.put("/units/update/:id",verifyToken,authorize('update', 'product', 'any'),updateUnit);       // PUT    /api/units/update/:id
router.delete("/units/delete/:id",verifyToken,authorize('delete', 'product', 'any'), deleteUnit);    // DELETE /api/units/delete/:id

export default router;
