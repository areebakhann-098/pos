import express from "express";
import {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
  searchProducts
} from "../controller/purchase.controller.js";

const router = express.Router(); 
router.post("/purchase/create", createPurchase); 
router.get("/search-products", searchProducts);
router.get("/purchase/get", getPurchases); 
router.get("/purchase/get_by_id/:id", getPurchaseById); 
router.put("/purchase/update/:id", updatePurchase); 
router.delete("/purchase/delete/:id", deletePurchase);

export default router;
 