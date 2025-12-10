import { Router } from 'express';
import salesController from '../controllers/salesController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/', salesController.list);
router.get('/stats', salesController.stats);

export default router;
