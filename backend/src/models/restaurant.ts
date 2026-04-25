import { query } from '../utils/db.js';
import { Restaurant, CreateRestaurantDTO, QueryResult } from './types.js';

export const getRestaurants = async (): Promise<Restaurant[]> => {
  const result = await query('SELECT * FROM restaurants WHERE is_active = 1 ORDER BY name');
  return result.rows as Restaurant[];
};

export const getRestaurantById = async (id: number): Promise<Restaurant | null> => {
  const result = await query('SELECT * FROM restaurants WHERE id = $1', [id]);
  return (result.rows[0] as Restaurant) || null;
};

export const createRestaurant = async (data: CreateRestaurantDTO): Promise<Restaurant> => {
  const result = await query(
    `INSERT INTO restaurants (name, slug, description, address, phone, email) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [data.name, data.slug || data.name.toLowerCase().replace(/\s+/g, '-'), data.description, data.address, data.phone, data.email]
  );
  return result.rows[0] as Restaurant;
};

export const updateRestaurant = async (id: number, data: Partial<CreateRestaurantDTO>): Promise<Restaurant> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  
  if (data.name !== undefined) { fields.push(`name = $${i++}`); values.push(data.name); }
  if (data.slug !== undefined) { fields.push(`slug = $${i++}`); values.push(data.slug); }
  if (data.description !== undefined) { fields.push(`description = $${i++}`); values.push(data.description); }
  if (data.address !== undefined) { fields.push(`address = $${i++}`); values.push(data.address); }
  if (data.phone !== undefined) { fields.push(`phone = $${i++}`); values.push(data.phone); }
  if (data.email !== undefined) { fields.push(`email = $${i++}`); values.push(data.email); }
  
  values.push(id);
  const result = await query(`UPDATE restaurants SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values);
  return result.rows[0] as Restaurant;
};

export default { getRestaurants, getRestaurantById, createRestaurant, updateRestaurant };