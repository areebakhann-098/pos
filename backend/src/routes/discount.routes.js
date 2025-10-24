import express from "express";
import {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
} from "../controller/discount.controller.js";
import { verifyToken } from '../middleware/jwt.middleware.js';
import { authorize } from '../middleware/accessControl.middleware.js';

const router = express.Router();

router.post("/discounts/create", verifyToken, authorize('create', 'product', 'any'), createDiscount);
router.get("/discounts/get", verifyToken, authorize('read', 'sale||product', 'any'), getAllDiscounts);
router.get("/discounts/:id", verifyToken, authorize('read', 'sale||product', 'any'),getDiscountById);
router.put("/discounts/:id", verifyToken, authorize('update', 'product', 'any'),updateDiscount);
router.delete("/discounts/delete/:id",verifyToken, authorize('delete', 'product', 'any'), deleteDiscount);

export default router;
