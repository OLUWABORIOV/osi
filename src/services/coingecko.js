export async function fetchCoinPrices(ids = ['bitcoin', 'ethereum', 'solana']) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch prices');
  return res.json();
} 