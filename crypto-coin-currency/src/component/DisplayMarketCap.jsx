import React, { useEffect, useRef } from "react";
import currencySymbols from "./serve_of_currency/Symbolsofcurrency";

// Conversion rates relative to USD
const conversionRates = {
  usd: 1,
  inr: 74.38,
  euro: 0.92,
  yen: 153.74,
  aed: 3.67,
  ruble: 85.97,
  yuan: 7.25,
};

export default function DisplayMarketCap({ coins, selectedCurrency }) {
  const scrollRef = useRef(null);

  const convertMarketCap = (marketCap) => {
    const rate = conversionRates[selectedCurrency] || 1;
    return (marketCap * rate).toLocaleString();
  };

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;

    const interval = setInterval(() => {
      if (scrollContainer) {
        scrollAmount += 1;
        if (scrollAmount >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
          scrollAmount = 0;
        }
        scrollContainer.scrollTo({ top: scrollAmount, behavior: "smooth" });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [coins]);

  return (
    <div className="bg-gray-900 rounded-2xl p-5 h-[670px] overflow-hidden shadow-xl">
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        Top Cryptocurrencies by <span className="text-indigo-500">Market Cap</span>
      </h3>

      <ul ref={scrollRef} className="space-y-4 overflow-hidden max-h-[600px] scrollbar-hide">
        {coins.map((coin) => {
          const change = coin.market_cap_change_percentage_24h;
          const isPositive = change >= 0;

          return (
            <li
              key={coin.id}
              className="flex justify-between items-center bg-gray-800 p-3 rounded-xl hover:scale-105 transform transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-white">{coin.name}</span>
                  <span className="text-gray-400 text-sm">
                    {currencySymbols[selectedCurrency]}
                    {convertMarketCap(coin.market_cap)}
                  </span>
                </div>
              </div>

              <div
                className={`font-semibold text-sm flex items-center gap-1 ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {change !== null && change !== undefined
                  ? `${isPositive ? "▲" : "▼"}${change.toFixed(2)}%`
                  : "N/A"}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
