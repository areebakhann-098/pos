import express from "express";
import {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
} from "../controller/sales.controller.js";
import { verifyToken } from '../middleware/jwt.middleware.js';
import { authorize } from '../middleware/accessControl.middleware.js';

const router = express.Router();

router.post("/sale/create",  verifyToken,authorize('create', 'sale','any'), createSale);
router.get("/sale/get", verifyToken, authorize('read', 'sale||product','any'),getAllSales);
router.get("/sale/:id",verifyToken,authorize('read', 'sale||product', 'any'), getSaleById);
router.put("/update/:id", verifyToken,authorize('update', 'sale||product', 'any'),updateSale);
router.delete("/delet/:id", verifyToken,authorize('delete', 'sale', 'any'), deleteSale);

export default router;
