import { query } from '../utils/db.js';
import { Table, CreateTableDTO } from './types.js';

export const tableModel = {
  findByRestaurant: async (restaurantId: number): Promise<Table[]> => {
    const result = await query('SELECT * FROM tables WHERE restaurant_id = $1 AND is_active = 1 ORDER BY number', [restaurantId]);
    return result.rows as Table[];
  },
  findById: async (id: number): Promise<Table | null> => {
    const result = await query('SELECT * FROM tables WHERE id = $1', [id]);
    return (result.rows[0] as Table) || null;
  },
  findByNumber: async (restaurantId: number, number: number): Promise<Table | null> => {
    const result = await query('SELECT * FROM tables WHERE restaurant_id = $1 AND number = $2', [restaurantId, number]);
    return (result.rows[0] as Table) || null;
  },
  findByQrCode: async (qrCode: string): Promise<Table | null> => {
    const result = await query('SELECT * FROM tables WHERE qr_code = $1', [qrCode]);
    return (result.rows[0] as Table) || null;
  },
  create: async (data: CreateTableDTO): Promise<number> => {
    const result = await query(
      'INSERT INTO tables (restaurant_id, number, qr_code) VALUES ($1, $2, $3) RETURNING id',
      [data.restaurant_id, data.number, `QR-MESA-${data.number}`]
    );
    return result.rows[0].id;
  },
  createBulk: async (restaurantId: number, numbers: number[]): Promise<void> => {
    for (const num of numbers) {
      await query(
        'INSERT INTO tables (restaurant_id, number, qr_code) VALUES ($1, $2, $3)',
        [restaurantId, num, `QR-MESA-${num}`]
      );
    }
  },
  delete: async (id: number): Promise<void> => {
    await query('UPDATE tables SET is_active = false WHERE id = $1', [id]);
  }
};