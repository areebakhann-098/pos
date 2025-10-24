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
 
router.post('/permissions/create', verifyToken, authorize('create', 'admin', 'any'), createPermission);
router.get('/permissions/get', verifyToken, authorize('read', 'admin', 'any'), getAllPermissions);
router.put('/permissions/update/:id', verifyToken, authorize('update', 'admin', 'any'),  updatePermission);
router.delete('/permissions/delete/:id', verifyToken,authorize('delete', 'admin', 'any'), deletePermission);
router.get('/permissions/get/:id', verifyToken, authorize('read', 'admin', 'any'), getPermissionById);
router.get('/permissions/resources', verifyToken, authorize('read', 'admin', 'any'), getAllResources);
 
export default router;