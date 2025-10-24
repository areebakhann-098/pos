import express from "express";
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controller/contact.controller.js";
import { verifyToken } from '../middleware/jwt.middleware.js';
import { authorize } from '../middleware/accessControl.middleware.js';

const router = express.Router();

// CREATE → POST /api/v1/contacts
router.post("/contacts",verifyToken, authorize('create', 'product', 'any'),createContact);

// READ ALL → GET /api/v1/contacts
router.get("/contacts", verifyToken, authorize('read', 'product', 'any'),getAllContacts);

// READ ONE → GET /api/v1/contacts/:id
router.get("/contacts/:id",verifyToken, authorize('read', 'product', 'any'), getContactById);

// UPDATE → PUT /api/v1/contacts/:id
router.put("/contacts/:id",verifyToken, authorize('update', 'product', 'any'), updateContact);

// DELETE → DELETE /api/v1/contacts/:id
router.delete("/contacts/:id",verifyToken, authorize('delete', 'product', 'any'), deleteContact);

export default router;
