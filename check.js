async function checkTables() {
  const res = await fetch('http://localhost:3000/api/tables/restaurant/1');
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

checkTables();