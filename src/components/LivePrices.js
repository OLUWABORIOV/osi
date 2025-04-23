import { useEffect, useState } from 'react';
import { fetchCoinPrices } from '../services/coingecko';
import { fetchStockPrice } from '../services/alphavantage';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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

export default function LivePrices() {
  // Stocks
  const [stockPrices, setStockPrices] = useState(null);
  const [loadingStocks, setLoadingStocks] = useState(false);
  const [stockError, setStockError] = useState(null);
  const [lastStockUpdate, setLastStockUpdate] = useState(null);
  // Crypto
  const [prices, setPrices] = useState(null);
  const [loadingCrypto, setLoadingCrypto] = useState(false);
  const [cryptoError, setCryptoError] = useState(null);
  const [lastCryptoUpdate, setLastCryptoUpdate] = useState(null);

  useEffect(() => {
    setLoadingStocks(true);
    let mounted = true;
    function fetchStocks() {
      Promise.all(STOCK_SYMBOLS.map(fetchStockPrice))
        .then(stocks => { if (mounted) { setStockPrices(stocks); setLastStockUpdate(new Date()); } })
        .catch(e => { if (mounted) setStockError(e.message); })
        .finally(() => { if (mounted) setLoadingStocks(false); });
    }
    fetchStocks();
    const interval = setInterval(fetchStocks, 60000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  useEffect(() => {
    setLoadingCrypto(true);
    let mounted = true;
    function fetchCrypto() {
      fetchCoinPrices(CRYPTO_IDS)
        .then(crypto => { if (mounted) { setPrices(crypto); setLastCryptoUpdate(new Date()); } })
        .catch(e => { if (mounted) setCryptoError(e.message); })
        .finally(() => { if (mounted) setLoadingCrypto(false); });
    }
    fetchCrypto();
    const interval = setInterval(fetchCrypto, 60000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return (
    <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Live Stock Prices</Typography>
        {loadingStocks ? (
          <Typography color="text.secondary">Loading stock prices...</Typography>
        ) : stockError ? (
          <Typography color="error">{stockError}</Typography>
        ) : stockPrices ? (
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 250 }}>
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
              </tbody>
            </table>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Last updated: {lastStockUpdate ? lastStockUpdate.toLocaleTimeString() : ''}
            </Typography>
          </Box>
        ) : null}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Live Crypto Prices</Typography>
        {loadingCrypto ? (
          <Typography color="text.secondary">Loading crypto prices...</Typography>
        ) : cryptoError ? (
          <Typography color="error">{cryptoError}</Typography>
        ) : prices ? (
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 250 }}>
              <thead>
                <tr>
                  <th align="left">Symbol</th>
                  <th align="right">Price (USD)</th>
                </tr>
              </thead>
              <tbody>
                {CRYPTO_IDS.map(id => (
                  <tr key={id}>
                    <td><b>{CRYPTO_LABELS[id]}</b></td>
                    <td align="right">${prices[id]?.usd?.toLocaleString() || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Last updated: {lastCryptoUpdate ? lastCryptoUpdate.toLocaleTimeString() : ''}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
} 