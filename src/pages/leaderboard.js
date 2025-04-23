import { useState, useEffect } from 'react';
import { mockTraders } from '../mockTraders';
import NavBar from '../components/NavBar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Link from 'next/link';
import { useAuth } from '../components/AuthContext';
import { useSnackbar } from '../components/SnackbarContext';
import LivePrices from '../components/LivePrices';

export default function Leaderboard({ darkMode, onToggleTheme }) {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [sortBy, setSortBy] = useState('performance');
  const [followed, setFollowed] = useState([]);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('followedTraders') || '[]');
    setFollowed(ids);
  }, []);

  const handleFollow = (id) => {
    const ids = JSON.parse(localStorage.getItem('followedTraders') || '[]');
    const updated = ids.includes(id) ? ids.filter(fid => fid !== id) : [...ids, id];
    localStorage.setItem('followedTraders', JSON.stringify(updated));
    setFollowed(updated);
    const trader = mockTraders.find(t => t.id === id);
    showSnackbar(`${ids.includes(id) ? 'Unfollowed' : 'Now following'} ${trader?.name || 'trader'}`);
  };

  const sorted = [...mockTraders].sort((a, b) => {
    if (sortBy === 'performance') return b.performance - a.performance;
    if (sortBy === 'followers') return b.followers - a.followers;
    return 0;
  });

  return (
    <>
      <NavBar darkMode={darkMode} onToggleTheme={onToggleTheme} />
      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 6 } }}>
        <LivePrices />
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontSize: { xs: '1.5rem', sm: '2rem' } }}>Leaderboard</Typography>
        <Tabs value={sortBy} onChange={(_, v) => setSortBy(v)} centered sx={{ mb: 3 }}>
          <Tab value="performance" label="By Performance" />
          <Tab value="followers" label="By Followers" />
        </Tabs>
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Rank</TableCell>
                <TableCell>Trader</TableCell>
                <TableCell align="center">Performance</TableCell>
                <TableCell align="center">Followers</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map((trader, idx) => {
                const isCurrentUser = user && user.username && trader.name.toLowerCase() === user.username.toLowerCase();
                return (
                  <TableRow
                    key={trader.id}
                    sx={{
                      background: isCurrentUser
                        ? 'rgba(255, 193, 7, 0.18)'
                        : idx < 3
                        ? 'rgba(25, 118, 210, 0.08)'
                        : 'inherit',
                    }}
                  >
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        {idx < 3 && <EmojiEventsIcon color={idx === 0 ? 'warning' : idx === 1 ? 'secondary' : 'success'} fontSize="small" />}
                        {idx + 1}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Link href={`/traders/${trader.id}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                          <Avatar src={trader.avatar} />
                          <Typography sx={{ ml: 1 }}>{trader.name}</Typography>
                        </Link>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{trader.performance}%</TableCell>
                    <TableCell align="center">{trader.followers}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant={followed.includes(trader.id) ? 'outlined' : 'contained'}
                        color="primary"
                        onClick={() => handleFollow(trader.id)}
                      >
                        {followed.includes(trader.id) ? 'Unfollow' : 'Follow'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
} 