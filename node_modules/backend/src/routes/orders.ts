import { Router, Request, Response } from 'express';
import { orderModel } from '../models/order.js';
import { tableModel } from '../models/table.js';
import { ApiResponse } from '../models/types.js';

const router = Router();

router.post('/', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const { table_number, items, tip = 0 } = req.body;
    
    if (!table_number || !items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Número de mesa y items requeridos' });
    }

    // Find table by number
    const tables = await tableModel.findByRestaurant(1);
    const table = tables.find(t => t.number === String(table_number));
    
    if (!table) {
      return res.status(404).json({ success: false, error: 'Mesa no encontrada' });
    }

    const orderItems = items.map((item: any) => ({
      product_id: item.product_id,
      name: item.name,
      price: Number(item.price),
      quantity: item.quantity
    }));

    console.log('Creating order for table:', table.id, table_number);
    
    const orderId = await orderModel.create(table.id, table_number, orderItems, tip);

    res.status(201).json({ success: true, data: { order_id: orderId, table: table_number } });
  } catch (error: any) {
    console.error('Error creating order:', error.message, error.stack);
    res.status(500).json({ success: false, error: 'Error al crear pedido: ' + error.message });
  }
});

router.get('/restaurant/:restaurantId', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const status = req.query.status as string;
    const orders = await orderModel.findByRestaurant(1, status);
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Error al obtener pedidos' });
  }
});

router.put('/:orderId/status', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const orderId = parseInt(req.params.orderId);
    const { status } = req.body;
    
    await orderModel.updateStatus(orderId, status);
    
    res.json({ success: true, message: 'Estado actualizado' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar pedido' });
  }
});

router.post('/:orderId/review', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const orderId = parseInt(req.params.orderId);
    const { table_number, rating, comment, tip_amount = 0 } = req.body;
    
    const reviewId = await orderModel.addReview(orderId, table_number, rating, comment || '', tip_amount);
    
    res.status(201).json({ success: true, data: { review_id: reviewId } });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ success: false, error: 'Error al agregar reseña' });
  }
});

router.get('/reviews', async (_req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const reviews = await orderModel.getReviews(1);
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, error: 'Error al obtener reseñas' });
  }
});

export default router;