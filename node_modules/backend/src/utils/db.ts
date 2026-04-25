import { Pool } from 'pg';
import { config } from './config.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => console.log('Database connection established'));

pool.on('error', (err) => console.error('Database connection error:', err));

export const query = async (sql: string, params?: unknown[]) => {
  const start = Date.now();
  try {
    const result = await pool.query(sql, params);
    const duration = Date.now() - start;
    console.log('Executed query', { sql, duration, rowCount: result.rowCount });
    return result;
  } catch (error) {
    console.error('Query error', { sql, error });
    throw error;
  }
};

export const getClient = () => pool.connect();

export default pool;