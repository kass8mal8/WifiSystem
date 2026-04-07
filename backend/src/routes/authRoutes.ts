import { Router } from 'express';
import { login, register, getMe, updateRouterSettings } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticate, getMe);
router.put('/me/router', authenticate, updateRouterSettings);

export default router;
