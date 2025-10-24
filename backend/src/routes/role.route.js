import express from 'express';
import {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole
} from '../controller/role.controller.js';
import { verifyToken } from '../middleware/jwt.middleware.js';
import { authorize } from '../middleware/accessControl.middleware.js';


 
const router = express.Router();
 
router.post('/roles/create', verifyToken, authorize('create', 'admin', 'any'), createRole);
router.get('/roles/get',verifyToken, authorize('create', 'admin', 'any'),  getAllRoles);
router.put('/roles/update/:id', verifyToken, authorize('update', 'admin', 'any'),updateRole);
router.delete('/roles/delete/:id', verifyToken, authorize('delete', 'admin', 'any'), deleteRole);
 
export default router;