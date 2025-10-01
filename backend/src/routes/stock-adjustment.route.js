import express from "express";
import {
  createStockAdjustment,
  getAllStockAdjustments,
  getStockAdjustmentById,
  updateStockAdjustment,
  deleteStockAdjustment,
} from "../controller/stock-adjustment.controller.js";

const router = express.Router();

router.post("/stockadjustment/create", createStockAdjustment);
router.get("/stockadjustment/list", getAllStockAdjustments);
router.get("/stockadjustment/list/:id", getStockAdjustmentById);
router.put("/stockadjustment/update/:id", updateStockAdjustment);
router.delete("/stockadjustment/delete/:id", deleteStockAdjustment);

export default router;
