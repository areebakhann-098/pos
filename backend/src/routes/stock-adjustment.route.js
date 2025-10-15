import express from "express";
import {
  createStockAdjustment,
  getAllStockAdjustments,
  getStockAdjustmentById,
  updateStockAdjustment,
  deleteStockAdjustment,
  searchProducts
} from "../controller/stock-adjustment.controller.js";

const router = express.Router();

router.post("/stockadjustment/create", createStockAdjustment);
router.get("/stockadjustment/list", getAllStockAdjustments);
router.get("/stockadjustment/list/:id", getStockAdjustmentById);
router.put("/stockadjustment/update/:id", updateStockAdjustment);
router.delete("/stockadjustment/delete/:id", deleteStockAdjustment);
router.get("/stockadjustment/search-products", searchProducts);


export default router;
