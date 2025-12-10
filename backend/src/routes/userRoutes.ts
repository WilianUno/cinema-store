import { Router } from 'express';
import userController from '../controllers/userController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/', userController.list);
router.get('/stats', userController.stats);
router.delete('/:id', userController.delete);

export default router;
