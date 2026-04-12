import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.trim() === "") {
    return NextResponse.json({ results: [] });
  }

  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    const data = await res.json();

    const cleaned = data.quotes
      ?.filter((item: any) => item.symbol && item.shortname)
      ?.map((item: any) => ({
        symbol: item.symbol,
        name: item.shortname,
        exchange: item.exchange,
        type: item.quoteType
      })) || [];

    return NextResponse.json({ results: cleaned });
  } catch (err) {
    return NextResponse.json({ results: [] });
  }
}
