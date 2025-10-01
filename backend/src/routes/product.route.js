// routes/product.routes.js
import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controller/product.controller.js";
import { authorize } from "../middleware/accessControl.middleware.js";
import {verifyToken} from '../middleware/jwt.middleware.js'
const router = express.Router();

router.post('/products/create', verifyToken, authorize('create', 'product', 'any'), createProduct);
router.delete('/products/delete/:id', verifyToken, authorize('delete', 'product', 'any'), deleteProduct);
router.get('/products/get', verifyToken, authorize('read', 'product', 'any'), getAllProducts);
router.get('/products/get/:id',  verifyToken,authorize('read', 'product', 'any'), getProductById);
router.patch('/products/update/:id', verifyToken, authorize('update', 'product', 'any'), updateProduct);
export default router;
