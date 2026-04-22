async function testOrder() {
  try {
    const res = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        table_number: '5',
        items: [
          { product_id: 1, name: 'Pizza', price: 2200, quantity: 1 }
        ],
        tip: 0
      })
    });
    const data = await res.json();
    console.log('Result:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testOrder();