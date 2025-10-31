import express from "express";
import {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
  searchProducts
} from "../controller/purchase.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";
import { authorize } from '../middleware/accessControl.middleware.js';
const router = express.Router();

//  Create Purchase
router.post(
  "/purchase/create",
  verifyToken,
authorize('create', 'product', 'any'),
  createPurchase
);

//  Search Products
router.get(
  "/search-products",
  verifyToken,
authorize('read', 'sale||product', 'any'),
  searchProducts
);

//  Get All Purchases
router.get(
  "/purchase/get",
  verifyToken,
 authorize('read', 'sale||product', 'any'),
  getPurchases
);

//  Get Purchase by ID
router.get(
  "/purchase/get_by_id/:id",
  verifyToken,
authorize('read', 'sale||product', 'any'),
  getPurchaseById
);

//  Update Purchase
router.put(
  "/purchase/update/:id",
  verifyToken,
authorize('update', 'product', 'any'),
  updatePurchase
);

//  Delete Purchase
router.delete(
  "/purchase/delete/:id",
  verifyToken,
 authorize('delete', 'product', 'any'),
  deletePurchase
);

export default router;
