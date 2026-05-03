// Script para agregar más productos al menú
// Ejecutar con: node agregar-productos.js

const API_URL = 'https://menu-qr-rest.onrender.com/api';
const RESTAURANT_ID = 1;

const categorias = [
  { name: 'Entradas', productos: [
    { name: 'Empanadas de carne (x3)', price: 1200 },
    { name: 'Empanadas de pollo (x3)', price: 1100 },
    { name: 'Provoleta', price: 1800 },
    { name: 'Tabla de fiambres', price: 2500 },
    { name: 'Papas fritas', price: 1500 },
  ]},
  { name: 'Platos Principales', productos: [
    { name: 'Bife de chorizo', price: 4200 },
    { name: 'Milanesa napolitana', price: 3800 },
    { name: 'Pollo grillé', price: 3200 },
    { name: 'Ravioles con salsa', price: 2800 },
    { name: 'Pizza muzzarella', price: 3500 },
    { name: 'Hamburguesa completa', price: 3000 },
  ]},
  { name: 'Bebidas', productos: [
    { name: 'Agua mineral', price: 400 },
    { name: 'Coca Cola', price: 600 },
    { name: 'Cerveza Quilmes', price: 800 },
    { name: 'Vino tinto (copa)', price: 900 },
    { name: 'Jugo de naranja', price: 700 },
    { name: 'Café', price: 500 },
  ]},
  { name: 'Postres', productos: [
    { name: 'Flan con dulce de leche', price: 1200 },
    { name: 'Helado (2 bochas)', price: 1400 },
    { name: 'Tiramisu', price: 1600 },
    { name: 'Panqueque con dulce de leche', price: 1300 },
    { name: 'Ensalada de frutas', price: 1100 },
  ]},
];

async function crearCategoriaYProductos(categoria) {
  try {
    // Crear categoría
    console.log(`\n📁 Creando categoría: ${categoria.name}`);
    const catRes = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant_id: RESTAURANT_ID,
        name: categoria.name,
      }),
    });
    
    const catData = await catRes.json();
    if (!catData.success) {
      console.log(`⚠️  Categoría ya existe o error: ${catData.error}`);
      return;
    }
    
    const categoryId = catData.data.id;
    console.log(`✅ Categoría creada (ID: ${categoryId})`);
    
    // Crear productos
    for (const producto of categoria.productos) {
      const prodRes = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: categoryId,
          restaurant_id: RESTAURANT_ID,
          name: producto.name,
          price: producto.price,
          is_available: true,
        }),
      });
      
      const prodData = await prodRes.json();
      if (prodData.success) {
        console.log(`  ✅ ${producto.name} - $${producto.price}`);
      } else {
        console.log(`  ⚠️  Error: ${producto.name}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function main() {
  console.log('🍽️  Agregando productos al menú...\n');
  
  for (const categoria of categorias) {
    await crearCategoriaYProductos(categoria);
    await new Promise(resolve => setTimeout(resolve, 500)); // Pausa entre categorías
  }
  
  console.log('\n✅ ¡Proceso completado!');
  console.log('Refrescá el menú para ver los cambios.');
}

main();
