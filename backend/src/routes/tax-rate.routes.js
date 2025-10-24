import express from "express";
import {
  createTaxRate,
  getTaxRates,
  getTaxRateById,
  updateTaxRate,
  deleteTaxRate,
  taxRateValidation,
} from "../controller/tax-rate.controller.js";
import { verifyToken } from '../middleware/jwt.middleware.js';
import { authorize } from '../middleware/accessControl.middleware.js';
const router = express.Router();

router.post("/tax-rates/create", taxRateValidation, verifyToken,authorize('create', 'product', 'any'),createTaxRate);
router.get("/tax-rates/get",verifyToken,authorize('read', 'sale||product', 'any'), getTaxRates);
router.get("/tax-rates/:id", verifyToken,authorize('read', 'sale||product', 'any'),getTaxRateById);
router.put("/tax-rates/:id", taxRateValidation,verifyToken,authorize('update', 'product', 'any'), updateTaxRate);
router.delete("/tax-rates/:id",verifyToken,authorize('update', 'product', 'any'), deleteTaxRate);

export default router;
