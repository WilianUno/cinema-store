import { Router } from 'express';
import { CartController } from '../controllers/cartController'; // Se o arquivo for minúsculo, ajuste aqui
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const cartController = new CartController();

router.use(authMiddleware);

router.post('/', cartController.addToCart); // Adicionar
router.get('/', cartController.getCart);    // Ver carrinho
router.delete('/:id', cartController.remove); // Remover item (pelo ID do item do carrinho)

export default router;