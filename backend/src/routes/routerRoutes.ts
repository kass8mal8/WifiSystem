import { Router } from 'express';
import { getRouterStatus, getConnectedDevices } from '../controllers/routerController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protect these routes as they interact with the physical hardware
router.get('/status', authenticate, getRouterStatus);
router.get('/devices', authenticate, getConnectedDevices);

export default router;
