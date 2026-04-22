async function checkTables() {
  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'Teito2009',
    database: 'menu_digital_qr'
  });
  const [tables] = await connection.query('SHOW TABLES');
  console.log('Tables:', tables);
  await connection.end();
}

checkTables();