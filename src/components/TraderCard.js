import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Link from 'next/link';

export default function TraderCard({ trader, onFollow }) {
  return (
    <Card
      component={Link}
      href={`/traders/${trader.id}`}
      sx={{
        minWidth: 250,
        maxWidth: 300,
        m: 1,
        border: '1.5px solid #90caf9',
        borderRadius: 3,
        boxShadow: '0 2px 12px 0 rgba(60,72,88,0.08)',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        cursor: 'pointer',
        textDecoration: 'none',
        '&:hover': {
          boxShadow: '0 4px 24px 0 rgba(60,72,88,0.18)',
          borderColor: '#1976d2',
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar src={trader.avatar} alt={trader.name} sx={{ mr: 2 }} />
          <Typography variant="h6">{trader.name}</Typography>
        </Box>
        <Typography color="text.secondary">Performance: {trader.performance}%</Typography>
        <Typography color="text.secondary">Followers: {trader.followers}</Typography>
        <Typography color="text.secondary">Assets: {trader.assets.join(', ')}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" onClick={() => onFollow(trader.id)}>
          Follow
        </Button>
      </CardActions>
    </Card>
  );
} 