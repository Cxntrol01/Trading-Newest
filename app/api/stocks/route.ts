import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // ⬅ prevents prerendering

export async function GET() {
  const exchanges = ["US", "TO", "LSE", "HK", "AS", "F"];
  const key = process.env.NEXT_PUBLIC_FINNHUB_KEY;

  let allSymbols: any[] = [];

  for (const ex of exchanges) {
    try {
      const url = `https://finnhub.io/api/v1/stock/symbol?exchange=${ex}&token=${key}`;
      const res = await fetch(url);

      if (!res.ok) {
        console.error(`Finnhub error for ${ex}:`, res.status);
        continue;
      }

      const data = await res.json();

      // Ensure data is always an array
      if (Array.isArray(data)) {
        allSymbols.push(...data);
      } else {
        console.error(`Unexpected Finnhub response for ${ex}:`, data);
      }
    } catch (err) {
      console.error(`Error fetching ${ex}:`, err);
    }
  }

  return NextResponse.json(allSymbols);
}
