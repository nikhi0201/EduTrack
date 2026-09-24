import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.post('/login', AuthController.login);
router.get('/me', authenticateJWT, AuthController.me);
router.post('/logout', AuthController.logout);

export default router;
