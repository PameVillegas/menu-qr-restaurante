const categories = ["Bebidas", "Postres"];

async function createCategories() {
  for (const name of categories) {
    await fetch("http://localhost:3000/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant_id: 1,
        name: name
      })
    });
    console.log("Created:", name);
  }
}

const drinks = [
  { name: "Coca Cola", price: 500, description: "350ml" },
  { name: "Agua Mineral", price: 350, description: "500ml" },
  { name: "Jugo", price: 400, description: "Natural" },
  { name: "Cerveza", price: 800, description: "Lata" },
];

const desserts = [
  { name: "Flan", price: 450, description: "Con dulce de leche" },
  { name: "Helado", price: 500, description: "3 bochas" },
  { name: "Tiramisu", price: 650, description: "Postre italiano" },
];

async function createProducts() {
  const drinksCat = await fetch("http://localhost:3000/api/categories/restaurant/1").then(r => r.json());
  const cat2 = drinksCat.data.find(c => c.name === "Bebidas");
  const cat3 = drinksCat.data.find(c => c.name === "Postres");

  for (const p of drinks) {
    await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant_id: 1,
        category_id: cat2.id,
        name: p.name,
        price: p.price,
        description: p.description,
        is_available: true
      })
    });
  }

  for (const p of desserts) {
    await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant_id: 1,
        category_id: cat3.id,
        name: p.name,
        price: p.price,
        description: p.description,
        is_available: true
      })
    });
  }
  console.log("Done!");
}

createCategories().then(createProducts);