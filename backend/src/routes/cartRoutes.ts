import { Router } from 'express';
import { CartController } from '../controllers/cartController'; // Se o arquivo for minúsculo, ajuste aqui
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const cartController = new CartController();

router.use(authMiddleware);

// Rotas específicas PRIMEIRO
router.delete('/clear', cartController.clear); // Limpar carrinho
router.post('/add', cartController.addToCart); // Alias para adicionar
router.put('/update', cartController.update); // Atualizar quantidade

// Rotas genéricas DEPOIS
router.get('/', cartController.getCart);    // Ver carrinho
router.post('/', cartController.addToCart); // Adicionar item
router.delete('/:id', cartController.remove); // Remover item específico

export default router;