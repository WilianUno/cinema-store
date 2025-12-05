import { Router } from 'express';
import { CheckoutController } from '../controllers/checkoutController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const checkoutController = new CheckoutController();

router.use(authMiddleware); // Protege tudo

router.post('/', checkoutController.checkout.bind(checkoutController)); // Finalizar compra
router.get('/', checkoutController.getMyOrders.bind(checkoutController)); // Ver histórico

export default router;