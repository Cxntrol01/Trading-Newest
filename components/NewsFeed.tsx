"use client";

import { useEffect, useState } from "react";

type NewsItem = {
  id?: number;
  headline: string;
  summary: string;
  source: string;
  datetime: number;
  url: string;
};

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error("Failed to load news");
        const data = await res.json();
        setNews(data);
      } catch (err) {
        setError("Could not load news right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <section className="border border-gray-800 rounded-lg p-6 bg-gray-900/40 backdrop-blur-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Market‑Moving News</h2>
        <p className="text-gray-500 text-sm">Loading important events…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="border border-gray-800 rounded-lg p-6 bg-gray-900/40 backdrop-blur-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Market‑Moving News</h2>
        <p className="text-red-400 text-sm">{error}</p>
      </section>
    );
  }

  if (!news.length) {
    return (
      <section className="border border-gray-800 rounded-lg p-6 bg-gray-900/40 backdrop-blur-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Market‑Moving News</h2>
        <p className="text-gray-500 text-sm">
          No major events detected right now.
        </p>
      </section>
    );
  }

  return (
    <section className="border border-gray-800 rounded-lg p-6 bg-gray-900/40 backdrop-blur-md shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Market‑Moving News</h2>

      <div className="flex flex-col gap-4 text-sm">
        {news.map((item, idx) => {
          const date = new Date(item.datetime * 1000);
          return (
            <a
              key={item.id ?? idx}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-gray-800/40 rounded-lg hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <div className="font-semibold text-white">
                    {item.headline}
                  </div>
                  <div className="text-gray-400 mt-1 line-clamp-2">
                    {item.summary}
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                  <div>{item.source}</div>
                  <div>{date.toLocaleString()}</div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
