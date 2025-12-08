import { Router } from 'express';
import { 
  register, 
  login, 
  current, 
  logout, 
  forgotPassword, 
  resetPassword 
} from '../controllers/sessionController.js';
import { authenticate } from '../utils/middlewares.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/current', authenticate, current);
router.post('/logout', authenticate, logout);

export default router;