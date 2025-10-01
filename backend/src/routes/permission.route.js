import express from 'express';
import {
  createPermission,
  getAllPermissions,
  updatePermission,
  deletePermission,
   getPermissionById,
   getAllResources
} from '../controller/permission.controller.js';
import { verifyToken } from '../middleware/jwt.middleware.js';
import { authorize } from '../middleware/accessControl.middleware.js';
 
const router = express.Router();
 
router.post('/permissions/create', verifyToken, authorize('create', 'user', 'any'), createPermission);
router.get('/permissions/get', verifyToken, authorize('read', 'user', 'any'), getAllPermissions);
router.put('/permissions/update/:id', verifyToken, authorize('update', 'user', 'any'),  updatePermission);
router.delete('/permissions/delete/:id', verifyToken,authorize('delete', 'user', 'any'), deletePermission);
router.get('/permissions/get/:id', verifyToken, authorize('read', 'user', 'any'), getPermissionById);
router.get('/permissions/resources', verifyToken, authorize('read', 'user', 'any'), getAllResources);
 
export default router;