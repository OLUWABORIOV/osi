import { useRouter } from 'next/router';
import { mockTraders } from '../../mockTraders';
import NavBar from '../../components/NavBar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import TradeFeed from '../../components/TradeFeed';
import LivePrices from '../../components/LivePrices';

// Mock performance data
const mockPerformance = [
  { month: 'Jan', value: 10000 },
  { month: 'Feb', value: 12000 },
  { month: 'Mar', value: 15000 },
  { month: 'Apr', value: 17000 },
  { month: 'May', value: 16000 },
  { month: 'Jun', value: 20000 },
];

// Mock trades for this demo
const mockTrades = [
  { traderId: 1, asset: 'BTC', action: 'buy', amount: 0.5, price: 65000, time: '2024-04-18T10:30:00Z' },
  { traderId: 1, asset: 'ETH', action: 'sell', amount: 1, price: 3200, time: '2024-04-17T14:10:00Z' },
  { traderId: 2, asset: 'TSLA', action: 'sell', amount: 10, price: 900, time: '2024-04-18T09:45:00Z' },
  { traderId: 1, asset: 'AAPL', action: 'buy', amount: 5, price: 180, time: '2024-04-16T11:00:00Z' },
];

const mockBios = {
  1: 'Alice is a seasoned crypto and stock trader with a focus on tech and DeFi.',
  2: 'Bob specializes in electric vehicles and blockchain assets.',
  3: 'Carol is a growth investor with a passion for AI and Web3.',
  4: 'David is a swing trader in US tech and meme coins.',
  5: 'Eva is a long-term investor in blue chips and Bitcoin.',
  6: 'Frank is a DeFi enthusiast and tech stock picker.',
  7: 'Grace is a social trader with a focus on trending assets.',
  8: 'Henry is a value investor and crypto early adopter.',
  9: 'Ivy is a momentum trader in both stocks and crypto.',
};

export default function TraderProfile({ darkMode, onToggleTheme }) {
  const router = useRouter();
  const { id } = router.query;
  const trader = mockTraders.find(t => t.id === Number(id));
  const [followed, setFollowed] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  // Persist follow state in localStorage
  useEffect(() => {
    if (!id) return;
    const followedIds = JSON.parse(localStorage.getItem('followedTraders') || '[]');
    setFollowed(followedIds.includes(Number(id)));
  }, [id]);

  const handleFollow = () => {
    const followedIds = JSON.parse(localStorage.getItem('followedTraders') || '[]');
    let updated;
    if (followed) {
      updated = followedIds.filter(fid => fid !== Number(id));
      setSnackbar('Unfollowed ' + trader.name);
    } else {
      updated = [...new Set([...followedIds, Number(id)])];
      setSnackbar('Now following ' + trader.name);
    }
    localStorage.setItem('followedTraders', JSON.stringify(updated));
    setFollowed(!followed);
  };

  if (!trader) {
    return (
      <>
        <NavBar darkMode={darkMode} onToggleTheme={onToggleTheme} />
        <Container sx={{ py: 8 }}>
          <Typography variant="h5">Trader not found.</Typography>
        </Container>
      </>
    );
  }

  const traderTrades = mockTrades.filter(trade => trade.traderId === trader.id);
  const isTopPerformer = trader.performance > 40;

  return (
    <>
      <NavBar darkMode={darkMode} onToggleTheme={onToggleTheme} />
      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 6 } }}>
        <LivePrices />
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/traders')} sx={{ mb: 3, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          Back to Traders
        </Button>
        <Card sx={{ p: { xs: 2, sm: 4 }, mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 2, sm: 4 }, boxShadow: 3, position: 'relative' }}>
          <Avatar src={trader.avatar} alt={trader.name} sx={{ width: 80, height: 80, mb: { xs: 2, sm: 0 } }} />
          <Box flex={1}>
            <Typography variant="h4" sx={{ fontSize: { xs: '1.3rem', sm: '2rem' } }}>{trader.name}</Typography>
            <Typography color="text.secondary" sx={{ mb: 1, fontSize: { xs: '1rem', sm: '1.1rem' } }}>{mockBios[trader.id]}</Typography>
            <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} mb={1}>
              <Typography variant="body1" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>Followers: <b>{trader.followers}</b></Typography>
              <Typography variant="body1" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>Performance: <b>{trader.performance}%</b></Typography>
              {isTopPerformer && <Chip label="Top Performer" color="success" size="small" />}
            </Box>
            <Button
              variant={followed ? 'outlined' : 'contained'}
              color="primary"
              onClick={e => { e.stopPropagation(); handleFollow(); }}
              sx={{ mt: 1, transition: 'all 0.2s', fontWeight: 600, fontSize: { xs: '0.95rem', sm: '1rem' } }}
            >
              {followed ? 'Unfollow' : 'Follow'}
            </Button>
          </Box>
        </Card>
        <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Performance</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={mockPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#1976d2" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
        <Typography variant="h6" sx={{ mt: 4, mb: 2, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Recent Trades</Typography>
        <TradeFeed trades={traderTrades} traders={[trader]} />
        <Snackbar
          open={!!snackbar}
          autoHideDuration={2000}
          onClose={() => setSnackbar('')}
          message={snackbar}
        />
      </Container>
    </>
  );
} 