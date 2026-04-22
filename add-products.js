const products = [
  { name: "Pizza", price: 2200, description: "Con salsa y mozzarella" },
  { name: "Empanadas", price: 450, description: "Carne, pollo o jamon y queso" },
  { name: "Milanesa", price: 1800, description: "Con guarnicion a eleccion" },
  { name: "Pasta", price: 1600, description: "Salsa Bolognesa o Alfredo" },
];

async function createProducts() {
  for (const p of products) {
    await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant_id: 1,
        category_id: 1,
        name: p.name,
        price: p.price,
        description: p.description,
        is_available: true
      })
    });
    console.log("Created:", p.name);
  }
}

createProducts();
