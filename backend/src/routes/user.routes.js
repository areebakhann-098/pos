import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,    
  deleteUser,
  updateUser
} from '../controller/user.controller.js';
 
import { authorize } from '../middleware/accessControl.middleware.js';
import { verifyToken } from '../middleware/jwt.middleware.js';

 
const router = express.Router();
 
router.post('/users/create', verifyToken, authorize('create', 'admin', 'any'), createUser);
router.patch('/users/update/:id', verifyToken, authorize('update', 'admin', 'any'),  updateUser);
router.get('/users/get', verifyToken, authorize('read', 'admin', 'any'), getAllUsers);
router.get('/users/get/:id', verifyToken, authorize('read', 'admin', 'any'), getUserById);
router.delete('/users/delete/:id', verifyToken, authorize('delete', 'admin', 'any'), deleteUser);
 
 
export default router;