import { Router } from 'express';
import {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    getGenres
} from '../controllers/movieController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAllMovies);          
router.get('/genres', getGenres);       
router.get('/:id', getMovieById);       

router.post('/', authMiddleware, adminMiddleware, createMovie);
router.put('/:id', authMiddleware, adminMiddleware, updateMovie);
router.delete('/:id', authMiddleware, adminMiddleware, deleteMovie);

export default router;