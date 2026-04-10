import { NextResponse } from "next/server";

export async function GET() {
  const exchanges = ["US", "TO", "LSE", "HK", "AS", "F"]; // add more if you want
  const key = process.env.NEXT_PUBLIC_FINNHUB_KEY;

  let allSymbols: any[] = [];

  for (const ex of exchanges) {
    const url = `https://finnhub.io/api/v1/stock/symbol?exchange=${ex}&token=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    allSymbols = [...allSymbols, ...data];
  }

  return NextResponse.json(allSymbols);
}
