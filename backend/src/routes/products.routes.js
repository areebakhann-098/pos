import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  
  searchProductsByCategory
} from "../controller/products.controller.js";
import { authorize } from "../middleware/accessControl.middleware.js";
import {verifyToken} from '../middleware/jwt.middleware.js'

const router = express.Router();

// Create Product
router.post("/product/create",verifyToken, authorize('create', 'product', 'any'),  createProduct);          // POST   /api/product/create

// Get all Products
router.get("/product/list", verifyToken,authorize('read', 'sale||product', 'any'),  getAllProducts);            // GET    /api/product/list

// Get Product by ID
router.get("/product/detail/:id",verifyToken, authorize('read', 'sale||product', 'any'), getProductById);      // GET    /api/product/detail/:id

// Update Product
router.put("/product/update/:id",verifyToken,authorize('update', 'sale||product', 'any'),  updateProduct);       // PUT    /api/product/update/:id

// Delete Product
router.delete("/product/delete/:id",verifyToken,authorize('delete', 'product', 'any'),  deleteProduct);    // DELETE /api/product/delete/:i
router.get("/products/search-products",verifyToken,authorize('read', 'sale||product', 'any'),   searchProductsByCategory);

export default router;
