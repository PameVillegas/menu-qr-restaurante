const tables = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

async function createTables() {
  for (const num of tables) {
    await fetch("http://localhost:3000/api/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant_id: 1,
        number: num
      })
    });
    console.log("Created table:", num);
  }
}

createTables();