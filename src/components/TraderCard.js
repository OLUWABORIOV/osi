import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Link from 'next/link';
import CheckIcon from '@mui/icons-material/Check';

export default function TraderCard({ trader, onFollow, isFollowed }) {
  return (
    <Card
      component={Link}
      href={`/traders/${trader.id}`}
      sx={{
        minWidth: { xs: '100%', sm: 250 },
        maxWidth: 300,
        width: { xs: '100%', sm: 'auto' },
        m: { xs: 0, sm: 1 },
        mb: { xs: 2, sm: 0 },
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
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar src={trader.avatar} alt={trader.name} sx={{ mr: 2, width: { xs: 40, sm: 56 }, height: { xs: 40, sm: 56 } }} />
          <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>{trader.name}</Typography>
        </Box>
        <Typography color="text.secondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>Performance: {trader.performance}%</Typography>
        <Typography color="text.secondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>Followers: {trader.followers}</Typography>
        <Typography color="text.secondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>Assets: {trader.assets.join(', ')}</Typography>
      </CardContent>
      <CardActions sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
        <Button
          size="medium"
          variant={isFollowed ? 'outlined' : 'contained'}
          color="primary"
          startIcon={isFollowed ? <CheckIcon /> : null}
          onClick={e => { e.preventDefault(); e.stopPropagation(); onFollow(trader.id); }}
          sx={{ width: '100%', fontSize: { xs: '1rem', sm: '1rem' }, py: { xs: 1.2, sm: 0.5 } }}
        >
          {isFollowed ? 'Following' : 'Follow'}
        </Button>
      </CardActions>
    </Card>
  );
} 