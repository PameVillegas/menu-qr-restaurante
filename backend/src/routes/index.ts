import { Router } from 'express';
import restaurantsRouter from './restaurants.js';
import categoriesRouter from './categories.js';
import productsRouter from './products.js';
import menuRouter from './menu.js';
import ordersRouter from './orders.js';
import tablesRouter from './tables.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'menu-digital-qr-api'
  });
});

router.get('/', (_req, res) => {
  res.json({ 
    message: 'Menu Digital QR API',
    version: '1.0.0'
  });
});

router.use('/restaurants', restaurantsRouter);
router.use('/categories', categoriesRouter);
router.use('/products', productsRouter);
router.use('/menu', menuRouter);
router.use('/orders', ordersRouter);
router.use('/tables', tablesRouter);

export default router;
