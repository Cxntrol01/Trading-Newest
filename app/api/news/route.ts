import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

const IMPORTANT_KEYWORDS = [
  "Fed",
  "FOMC",
  "rate hike",
  "rate cut",
  "interest rates",
  "inflation",
  "CPI",
  "PPI",
  "earnings",
  "guidance",
  "acquisition",
  "merger",
  "lawsuit",
  "SEC",
  "antitrust",
  "recession",
  "GDP",
  "jobs report",
  "unemployment",
];

function isImportant(headline: string, summary: string) {
  const text = `${headline} ${summary}`.toLowerCase();
  return IMPORTANT_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
}

export async function GET() {
  if (!FINNHUB_API_KEY) {
    return NextResponse.json(
      { error: "FINNHUB_API_KEY is not set" },
      { status: 500 }
    );
  }

  try {
    const url = `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Finnhub error: ${res.status}`);
    }

    const data = await res.json();

    const filtered = (data as any[])
      .filter((item) => isImportant(item.headline, item.summary || ""))
      .slice(0, 10);

    return NextResponse.json(filtered);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
