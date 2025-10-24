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
router.post('/role-permission/assign', verifyToken,  authorize('create', 'admin', 'any'), assignPermissionToRole);
 
// Read
router.get('/role-permission/get', verifyToken, authorize('read', 'admin', 'any'), getAllRolePermissions);
 
// Update
router.put('/role-permission/update/:id', verifyToken, authorize('update', 'admin', 'any'), updateRolePermission);
 
// Delete
router.delete('/role-permission/delete/:id', verifyToken, authorize('delete', 'admin', 'any'), deleteRolePermission);
 
 
export default router;