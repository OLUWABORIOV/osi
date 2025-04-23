import NavBar from '../components/NavBar';
import TradeFeed from '../components/TradeFeed';
import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuth } from '../components/AuthContext';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import Box from '@mui/material/Box';
import { generateMockTrades, generateMockPortfolio, getDemoTrades, setDemoTrades, getDemoPortfolio, setDemoPortfolio } from '../mockDemoData';
import { mockTraders } from '../mockTraders';
import { useSnackbar } from '../components/SnackbarContext';
import { fetchCoinPrices } from '../services/coingecko';
import { fetchStockPrice } from '../services/alphavantage';

const mockTrades = [
  { traderId: 1, asset: 'BTC', action: 'buy', amount: 0.5, price: 65000, time: '2024-04-18T10:30:00Z' },
  { traderId: 2, asset: 'TSLA', action: 'sell', amount: 10, price: 900, time: '2024-04-18T09:45:00Z' },
  { traderId: 3, asset: 'ETH', action: 'buy', amount: 2, price: 3200, time: '2024-04-18T08:20:00Z' },
  { traderId: 4, asset: 'AMZN', action: 'buy', amount: 3, price: 3400, time: '2024-04-18T07:10:00Z' },
  { traderId: 5, asset: 'LTC', action: 'sell', amount: 5, price: 180, time: '2024-04-18T06:55:00Z' },
  { traderId: 6, asset: 'BNB', action: 'buy', amount: 1, price: 400, time: '2024-04-18T06:30:00Z' },
  { traderId: 7, asset: 'SOL', action: 'buy', amount: 8, price: 150, time: '2024-04-18T05:50:00Z' },
  { traderId: 8, asset: 'ADA', action: 'sell', amount: 100, price: 1.2, time: '2024-04-18T05:20:00Z' },
  { traderId: 9, asset: 'DOGE', action: 'buy', amount: 200, price: 0.08, time: '2024-04-18T04:40:00Z' },
];

const mockPortfolio = [
  { asset: 'BTC', value: 32000 },
  { asset: 'ETH', value: 12000 },
  { asset: 'AAPL', value: 8000 },
  { asset: 'TSLA', value: 6000 },
  { asset: 'SOL', value: 4000 },
];

const COLORS = ['#1976d2', '#90caf9', '#43a047', '#fbc02d', '#e57373'];

const STOCK_SYMBOLS = ['AAPL', 'TSLA', 'MSFT', 'GOOG', 'AMZN', 'NVDA'];
const CRYPTO_IDS = ['bitcoin', 'ethereum', 'solana', 'dogecoin', 'cardano', 'binancecoin'];
const CRYPTO_LABELS = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  solana: 'SOL',
  dogecoin: 'DOGE',
  cardano: 'ADA',
  binancecoin: 'BNB',
};

export default function Dashboard({ darkMode, onToggleTheme }) {
  const { user, login } = useAuth();
  const { showSnackbar } = useSnackbar();
  // Get followed traders from localStorage
  const [followed, setFollowed] = useState([]);
  const [trades, setTrades] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [prices, setPrices] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [priceError, setPriceError] = useState(null);
  const [stockPrices, setStockPrices] = useState(null);
  const [loadingStocks, setLoadingStocks] = useState(false);
  const [stockError, setStockError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('followedTraders') || '[]');
    setFollowed(ids);
    setTrades(getDemoTrades().length ? getDemoTrades() : generateAndSetTrades());
    setPortfolio(getDemoPortfolio().length ? getDemoPortfolio() : generateAndSetPortfolio());
  }, []);

  useEffect(() => {
    setLoadingPrices(true);
    let mounted = true;
    function fetchPrices() {
      fetchCoinPrices(CRYPTO_IDS)
        .then(prices => { if (mounted) setPrices(prices); })
        .catch(e => { if (mounted) setPriceError(e.message); })
        .finally(() => { if (mounted) setLoadingPrices(false); });
    }
    fetchPrices();
    const interval = setInterval(() => { fetchPrices(); setLastUpdated(new Date()); }, 60000);
    setLastUpdated(new Date());
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  useEffect(() => {
    setLoadingStocks(true);
    let mounted = true;
    function fetchStocks() {
      Promise.all(STOCK_SYMBOLS.map(fetchStockPrice))
        .then(prices => { if (mounted) setStockPrices(prices); })
        .catch(e => { if (mounted) setStockError(e.message); })
        .finally(() => { if (mounted) setLoadingStocks(false); });
    }
    fetchStocks();
    const interval = setInterval(fetchStocks, 60000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  function generateAndSetTrades() {
    const t = generateMockTrades(mockTraders, 12);
    setDemoTrades(t);
    return t;
  }
  function generateAndSetPortfolio() {
    const p = generateMockPortfolio();
    setDemoPortfolio(p);
    return p;
  }

  const handleRefreshDemo = () => {
    setTrades(generateAndSetTrades());
    setPortfolio(generateAndSetPortfolio());
    showSnackbar('Demo data refreshed!');
  };

  // Filter trades to only those from followed traders
  const followedTrades = trades.filter(trade => followed.includes(trade.traderId));

  const totalValue = portfolio.reduce((sum, a) => sum + a.value, 0);
  const bestAsset = portfolio.reduce((best, a) => (a.value > (best?.value || 0) ? a : best), null);
  const mockGains = 0.12; // 12% gains (mocked)

  if (!user) {
    let input;
    return (
      <>
        <NavBar darkMode={darkMode} onToggleTheme={onToggleTheme} />
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Login to view your dashboard</Typography>
          <form onSubmit={e => { e.preventDefault(); login(input.value); }}>
            <input ref={el => (input = el)} placeholder="Enter username" style={{ padding: 8, fontSize: 16, width: '100%', marginBottom: 16 }} />
            <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
          </form>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar darkMode={darkMode} onToggleTheme={onToggleTheme} />
      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4, md: 6 } }}>
        <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
          <Button variant="outlined" color="secondary" size="small" onClick={handleRefreshDemo}>
            Refresh Demo Data
          </Button>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Live Prices</Typography>
          {(loadingStocks || loadingPrices) ? (
            <Typography color="text.secondary">Loading prices...</Typography>
          ) : (stockError || priceError) ? (
            <Typography color="error">{stockError || priceError}</Typography>
          ) : (stockPrices && prices) ? (
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
                <thead>
                  <tr>
                    <th align="left">Symbol</th>
                    <th align="right">Price (USD)</th>
                    <th align="right">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {stockPrices.map(sp => (
                    <tr key={sp.symbol}>
                      <td><b>{sp.symbol}</b></td>
                      <td align="right">${sp.price?.toLocaleString() || 'N/A'}</td>
                      <td align="right" style={{ color: sp.change > 0 ? 'green' : sp.change < 0 ? 'red' : undefined }}>{sp.percent}</td>
                    </tr>
                  ))}
                  {CRYPTO_IDS.map(id => (
                    <tr key={id}>
                      <td><b>{CRYPTO_LABELS[id]}</b></td>
                      <td align="right">${prices[id]?.usd?.toLocaleString() || 'N/A'}</td>
                      <td align="right">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : ''}
              </Typography>
            </Box>
          ) : null}
        </Box>
        <Typography variant="h4" sx={{ mb: 4, fontSize: { xs: '1.5rem', sm: '2rem' } }}>Your Portfolio</Typography>
        <Box display="flex" flexWrap="wrap" alignItems="stretch" justifyContent="space-between" sx={{ mb: 4, gap: { xs: 2, sm: 0 } }}>
          <Box sx={{ flex: '1 1 100%', minWidth: { xs: '45%', sm: 0 }, mb: { xs: 2, sm: 0 } }}>
            <Typography variant="h6">Total Value</Typography>
            <Typography variant="h5" color="primary">${totalValue.toLocaleString()}</Typography>
          </Box>
          <Box sx={{ flex: '1 1 100%', minWidth: { xs: '45%', sm: 0 }, mb: { xs: 2, sm: 0 } }}>
            <Typography variant="h6">Assets</Typography>
            <Typography variant="h5">{portfolio.length}</Typography>
          </Box>
          <Box sx={{ flex: '1 1 100%', minWidth: { xs: '45%', sm: 0 }, mb: { xs: 2, sm: 0 } }}>
            <Typography variant="h6">Best Asset</Typography>
            <Typography variant="h5">{bestAsset.asset} (${bestAsset.value.toLocaleString()})</Typography>
          </Box>
          <Box sx={{ flex: '1 1 100%', minWidth: { xs: '45%', sm: 0 } }}>
            <Typography variant="h6">Gains</Typography>
            <Typography variant="h5" color={mockGains >= 0 ? 'success.main' : 'error.main'}>
              {mockGains >= 0 ? '+' : ''}{(mockGains * 100).toFixed(2)}%
            </Typography>
          </Box>
        </Box>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={portfolio} dataKey="value" nameKey="asset" cx="50%" cy="50%" outerRadius={100} label>
              {portfolio.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <Typography variant="h4" sx={{ mt: 6, mb: 4, fontSize: { xs: '1.5rem', sm: '2rem' } }}>Your Trade Feed</Typography>
        {followed.length === 0 ? (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            You are not following any traders yet. Go to the Traders page and follow some to see their trades here!
          </Typography>
        ) : followedTrades.length === 0 ? (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No recent trades from your followed traders.
          </Typography>
        ) : (
          <TradeFeed trades={followedTrades} traders={mockTraders} />
        )}
      </Container>
    </>
  );
} 