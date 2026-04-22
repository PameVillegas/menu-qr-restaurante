async function test() {
  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'Teito2009',
    database: 'menu_digital_qr'
  });
  
  try {
    const [result] = await connection.execute(
      'INSERT INTO orders (table_id, table_number, total, tip) VALUES (?, ?, ?, ?)',
      [1, '5', 2200, 0]
    );
    console.log('Insert result:', result);
  } catch (err) {
    console.error('Error:', err.message);
  }
  
  await connection.end();
}

test();