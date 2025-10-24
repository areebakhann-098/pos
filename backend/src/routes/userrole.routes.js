import express from 'express';
import { authorize } from "../middleware/accessControl.middleware.js";
import {verifyToken} from '../middleware/jwt.middleware.js'
import {
  assignRoleToUser,
  getAllUserRoles,
  updateUserRole,
  deleteUserRole
} from '../controller/userrole.controller.js';
 
const router = express.Router();
 
// Create
router.post('/user-role/assign', verifyToken, authorize('create', 'admin', 'any'), assignRoleToUser);
 
// Read
router.get('/user-role/get', verifyToken, authorize('read', 'admin', 'any'), getAllUserRoles);
 
// Update
router.patch('/user-role/update/:id', verifyToken, authorize('update', 'admin', 'any'), updateUserRole);
 
// Delete
router.delete('/user-role/delete/:id', verifyToken, authorize('delete', 'admin', 'any'), deleteUserRole);
 
export default router;