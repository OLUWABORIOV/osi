import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString();
}

export default function TradeFeed({ trades, traders }) {
  if (!trades.length) {
    return <Typography color="text.secondary">No recent trades from followed traders.</Typography>;
  }
  return (
    <List>
      {trades.map((trade, idx) => {
        const trader = traders.find(t => t.id === trade.traderId);
        return (
          <ListItem key={idx} alignItems="flex-start" sx={{ mb: 2, borderBottom: '1px solid #e0e0e0' }}>
            <ListItemAvatar>
              <Avatar src={trader?.avatar} alt={trader?.name} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="subtitle1" fontWeight={600}>{trader?.name}</Typography>
                  <Chip label={trade.action.toUpperCase()} color={trade.action === 'buy' ? 'success' : 'error'} size="small" />
                  <Typography variant="body2" color="text.secondary">{formatTime(trade.time)}</Typography>
                </Box>
              }
              secondary={
                <Typography variant="body2">
                  {trade.action === 'buy' ? 'Bought' : 'Sold'} <b>{trade.amount}</b> {trade.asset} @ ${trade.price}
                </Typography>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
} 