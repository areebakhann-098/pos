import express from "express";
import {
  createTaxRate,
  getTaxRates,
  getTaxRateById,
  updateTaxRate,
  deleteTaxRate,
  taxRateValidation,
} from "../controller/tax-rate.controller.js";

const router = express.Router();

router.post("/tax-rates/create", taxRateValidation, createTaxRate);
router.get("/tax-rates/get", getTaxRates);
router.get("/tax-rates/:id", getTaxRateById);
router.put("/tax-rates/:id", taxRateValidation, updateTaxRate);
router.delete("/tax-rates/:id", deleteTaxRate);

export default router;
