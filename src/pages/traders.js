import NavBar from '../components/NavBar';
import TraderCard from '../components/TraderCard';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { mockTraders } from '../mockTraders';

export default function Traders() {
  const [followed, setFollowed] = useState([]);

  const handleFollow = (id) => {
    setFollowed((prev) => [...prev, id]);
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <h1 style={{ marginBottom: 32, textAlign: 'center' }}>Traders</h1>
        <Grid container spacing={4} justifyContent="center">
          {mockTraders.map((trader) => (
            <Grid item key={trader.id} xs={12} sm={6} md={4} lg={3} display="flex" justifyContent="center">
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