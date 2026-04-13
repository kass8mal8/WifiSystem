import { Router } from 'express';
import { getUsers, createUser, deleteUser, updateUser, getPayments, revokeUser } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication to all user management routes
router.get('/', authenticate, getUsers);
router.get('/payments', authenticate, getPayments);
router.post('/', authenticate, createUser);
router.delete('/:id', authenticate, deleteUser);
router.patch('/:id/revoke', authenticate, revokeUser);
router.put('/:id', authenticate, updateUser);

export default router;
