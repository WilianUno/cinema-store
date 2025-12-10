import { Router } from 'express';
import { MovieController } from '../controllers/movieController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();
const movieController = new MovieController();

// Rotas específicas PRIMEIRO
router.get('/featured', movieController.featured);
router.get('/upcoming', movieController.upcoming);
router.get('/search', movieController.search);
router.get('/category/:category', movieController.byCategory);

// Rotas genéricas DEPOIS
router.get('/', movieController.index);
router.get('/:id', movieController.show);

router.post('/', authMiddleware, adminMiddleware, movieController.create);
router.put('/:id', authMiddleware, adminMiddleware, movieController.update);
router.delete('/:id', authMiddleware, adminMiddleware, movieController.delete);

export default router;