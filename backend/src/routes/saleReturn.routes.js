// routes/saleReturn.routes.js
import express from "express";
import {
  createSaleReturn,
  getAllSaleReturns,
} from "../controller/saleReturn.controller.js";
import { verifyToken } from '../middleware/jwt.middleware.js';
import { authorize } from '../middleware/accessControl.middleware.js';

const router = express.Router();

router.post("/sale-return/create", verifyToken,authorize('create', 'sale', 'any'), createSaleReturn);
router.get("/sale-return/get",verifyToken,authorize('read', 'sale', 'any'), getAllSaleReturns);

export default router;
