import fs from "fs";

async function fetchSymbols() {
  const res = await fetch("https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=10000", {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json"
    }
  });

  const json = await res.json();
  const rows = json.data.table.rows;

  const cleaned = rows.map(r => ({
    symbol: r.symbol,
    name: r.name,
    exchange: r.exchange,
    type: r.type
  }));

  fs.writeFileSync("./data/us-stocks.json", JSON.stringify(cleaned, null, 2));
  console.log("Saved us-stocks.json with", cleaned.length, "symbols");
}

fetchSymbols();
