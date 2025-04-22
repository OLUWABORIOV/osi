import NavBar from '../components/NavBar';
import TradeFeed from '../components/TradeFeed';
import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuth } from '../components/AuthContext';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import Box from '@mui/material/Box';

// Import mockTraders from the new mockTraders.js file
import { mockTraders } from '../mockTraders';

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

export default function Dashboard() {
  const { user, login } = useAuth();
  // For demo, assume user follows all traders
  const followed = mockTraders.map(t => t.id);
  // Filter trades to only those from followed traders
  const followedTrades = mockTrades.filter(trade => followed.includes(trade.traderId));

  const totalValue = mockPortfolio.reduce((sum, a) => sum + a.value, 0);
  const bestAsset = mockPortfolio.reduce((best, a) => (a.value > (best?.value || 0) ? a : best), null);
  const mockGains = 0.12; // 12% gains (mocked)

  if (!user) {
    let input;
    return (
      <>
        <NavBar />
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
      <NavBar />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Your Portfolio</Typography>
        <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h6">Total Value</Typography>
            <Typography variant="h5" color="primary">${totalValue.toLocaleString()}</Typography>
          </Box>
          <Box>
            <Typography variant="h6">Assets</Typography>
            <Typography variant="h5">{mockPortfolio.length}</Typography>
          </Box>
          <Box>
            <Typography variant="h6">Best Asset</Typography>
            <Typography variant="h5">{bestAsset.asset} (${bestAsset.value.toLocaleString()})</Typography>
          </Box>
          <Box>
            <Typography variant="h6">Gains</Typography>
            <Typography variant="h5" color={mockGains >= 0 ? 'success.main' : 'error.main'}>
              {mockGains >= 0 ? '+' : ''}{(mockGains * 100).toFixed(2)}%
            </Typography>
          </Box>
        </Box>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={mockPortfolio} dataKey="value" nameKey="asset" cx="50%" cy="50%" outerRadius={100} label>
              {mockPortfolio.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <Typography variant="h4" sx={{ mt: 6, mb: 4 }}>Your Trade Feed</Typography>
        <TradeFeed trades={followedTrades} traders={mockTraders} />
      </Container>
    </>
  );
} 