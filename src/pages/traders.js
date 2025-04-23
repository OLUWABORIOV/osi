import NavBar from '../components/NavBar';
import TraderCard from '../components/TraderCard';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { useState, useEffect } from 'react';
import { mockTraders } from '../mockTraders';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import { useSnackbar } from '../components/SnackbarContext';

export default function Traders({ darkMode, onToggleTheme }) {
  const [followed, setFollowed] = useState([]);
  const [tab, setTab] = useState(0);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('followedTraders') || '[]');
    setFollowed(ids);
  }, []);

  const handleFollow = (id) => {
    let action;
    setFollowed((prev) => {
      if (prev.includes(id)) {
        action = 'Unfollowed';
        return prev.filter(fid => fid !== id);
      } else {
        action = 'Now following';
        return [...prev, id];
      }
    });
    const trader = mockTraders.find(t => t.id === id);
    showSnackbar(`${action} ${trader?.name || 'trader'}`);
  };

  const displayedTraders = tab === 0 ? mockTraders : mockTraders.filter(t => followed.includes(t.id));

  return (
    <>
      <NavBar darkMode={darkMode} onToggleTheme={onToggleTheme} />
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4, md: 6 } }}>
        <h1 style={{ marginBottom: 24, textAlign: 'center', fontSize: '2rem' }}>Traders</h1>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 3 }}>
          <Tab label="All Traders" />
          <Tab label={<Badge color="primary" badgeContent={followed.length}>Following</Badge>} />
        </Tabs>
        <Grid container columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} columnSpacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
          {displayedTraders.length === 0 ? (
            <Grid xs={12}>
              <Typography color="text.secondary" align="center">
                {tab === 1 ? 'You are not following any traders yet.' : 'No traders found.'}
              </Typography>
            </Grid>
          ) : displayedTraders.map((trader) => (
            <Grid key={trader.id} xs={1} sm={1} md={1} lg={1} display="flex" justifyContent="center">
              <TraderCard
                trader={trader}
                onFollow={handleFollow}
                isFollowed={followed.includes(trader.id)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
} 