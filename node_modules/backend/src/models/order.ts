import { query, getClient } from '../utils/db.js';
import { Order, OrderItem } from './types.js';

export const getOrders = async (restaurantId: number): Promise<Order[]> => {
  const result = await query('SELECT * FROM orders WHERE restaurant_id = $1 ORDER BY created_at DESC', [restaurantId]);
  return result.rows as Order[];
};

export const getOrderById = async (id: number): Promise<Order | null> => {
  const result = await query('SELECT * FROM orders WHERE id = $1', [id]);
  return (result.rows[0] as Order) || null;
};

export const createOrder = async (data: { restaurant_id: number; table_id: number; customer_name: string; items: OrderItem[]; notes?: string }): Promise<Order> => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const orderResult = await client.query(
      `INSERT INTO orders (restaurant_id, table_id, customer_name, status, total, tip_amount, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [data.restaurant_id, data.table_id, data.customer_name, 'pending', 0, 0, data.notes]
    );
    const order = orderResult.rows[0] as Order;
    
    let total = 0;
    for (const item of data.items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal, notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [order.id, item.product_id, item.product_name, item.quantity, item.unit_price, item.subtotal, item.notes]
      );
      total += item.subtotal;
    }
    
    await client.query('COMMIT');
    return { ...order, total };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export const updateOrderStatus = async (id: number, status: string): Promise<Order> => {
  const result = await query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, id]);
  return result.rows[0] as Order;
};

export const getOrderItems = async (orderId: number): Promise<OrderItem[]> => {
  const result = await query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
  return result.rows as OrderItem[];
};

export default { getOrders, getOrderById, createOrder, updateOrderStatus, getOrderItems };