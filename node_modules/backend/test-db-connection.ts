import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'menu_digital_qr',
  user: 'user',
  password: 'password',
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const client = await pool.connect();
    console.log('✓ Connected to database successfully!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✓ Query executed successfully:', result.rows[0]);
    
    client.release();
    await pool.end();
    
    console.log('✓ Connection test passed!');
  } catch (error) {
    console.error('✗ Connection test failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
