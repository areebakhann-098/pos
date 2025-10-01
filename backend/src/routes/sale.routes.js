import express from "express";
import {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
} from "../controller/sales.controller.js";

const router = express.Router();

router.post("/sale/create", createSale);
router.get("/sale/get", getAllSales);
router.get("/sale/:id", getSaleById);
router.put("/update/:id", updateSale);
router.delete("/delet/:id", deleteSale);

export default router;
