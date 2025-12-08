import { Router } from 'express';
import { 
  createCart, 
  getCart, 
  addProductToCart, 
  purchaseCart 
} from '../controllers/cartController.js';
import { authenticate, authorizeUser } from '../utils/middlewares.js';

const router = Router();

router.post('/', createCart);
router.get('/:cid', getCart);

router.post('/:cid/product/:pid', authenticate, authorizeUser, addProductToCart);
router.post('/:cid/purchase', authenticate, authorizeUser, purchaseCart);

export default router;