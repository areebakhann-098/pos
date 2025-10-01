import express from "express";
import {
  createPrice,
  getAllPrices,
  getPriceById,
  updatePrice,
  deletePrice,
} from "../controller/price.controller.js";

const router = express.Router();

// Create Price
router.post("/price/create", createPrice);          // POST   /api/price/create

// Get all Prices
router.get("/price/list", getAllPrices);           // GET    /api/price/list

// Get Price by ID
router.get("/price/detail/:id", getPriceById);     // GET    /api/price/detail/:id

// Update Price
router.put("/price/update/:id", updatePrice);      // PUT    /api/price/update/:id

// Delete Price
router.delete("/price/delete/:id", deletePrice);   // DELETE /api/price/delete/:id

export default router;
