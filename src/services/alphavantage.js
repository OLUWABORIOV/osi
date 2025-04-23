export async function fetchStockPrice(symbol) {
  const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch stock price');
  const data = await res.json();
  if (!data["Global Quote"] || !data["Global Quote"]["05. price"]) throw new Error('No price data');
  return {
    symbol,
    price: parseFloat(data["Global Quote"]["05. price"]),
    change: parseFloat(data["Global Quote"]["09. change"]),
    percent: data["Global Quote"]["10. change percent"],
  };
} 