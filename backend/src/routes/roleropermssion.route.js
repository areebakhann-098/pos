import express from 'express';
import {
  assignPermissionToRole,
  getAllRolePermissions,
  updateRolePermission,
  deleteRolePermission
} from '../controller/roletopermission.controller.js';
import { verifyToken } from '../middleware/jwt.middleware.js';
import { authorize } from '../middleware/accessControl.middleware.js';
 
 
const router = express.Router();
 
// Create
router.post('/role-permission/assign', verifyToken,  authorize('create', 'user', 'any'), assignPermissionToRole);
 
// Read
router.get('/role-permission/get', verifyToken, authorize('read', 'user', 'any'), getAllRolePermissions);
 
// Update
router.put('/role-permission/update/:id', verifyToken, authorize('update', 'user', 'any'), updateRolePermission);
 
// Delete
router.delete('/role-permission/delete/:id', verifyToken, authorize('delete', 'user', 'any'), deleteRolePermission);
 
 
export default router;