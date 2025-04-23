// Utility to get a random element
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const assets = ['BTC', 'ETH', 'AAPL', 'TSLA', 'SOL', 'GOOGL', 'AMZN', 'DOGE', 'XRP', 'LTC', 'MSFT', 'BNB', 'FB', 'ADA'];

export function generateMockTrades(traders, count = 12) {
  const actions = ['buy', 'sell'];
  const trades = [];
  for (let i = 0; i < count; i++) {
    const trader = rand(traders);
    const asset = rand(trader.assets);
    trades.push({
      traderId: trader.id,
      asset,
      action: rand(actions),
      amount: +(Math.random() * 10 + 1).toFixed(2),
      price: +(Math.random() * 1000 + 10).toFixed(2),
      time: new Date(Date.now() - Math.random() * 1e7).toISOString(),
    });
  }
  return trades;
}

export function generateMockPortfolio() {
  const n = Math.floor(Math.random() * 4) + 3;
  const picks = Array.from({ length: n }, () => rand(assets));
  const unique = [...new Set(picks)];
  return unique.map(asset => ({ asset, value: +(Math.random() * 20000 + 2000).toFixed(2) }));
}

export function getDemoTrades() {
  return JSON.parse(localStorage.getItem('demoTrades') || '[]');
}

export function setDemoTrades(trades) {
  localStorage.setItem('demoTrades', JSON.stringify(trades));
}

export function getDemoPortfolio() {
  return JSON.parse(localStorage.getItem('demoPortfolio') || '[]');
}

export function setDemoPortfolio(portfolio) {
  localStorage.setItem('demoPortfolio', JSON.stringify(portfolio));
} 