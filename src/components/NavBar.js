import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/router';

export default function NavBar({ darkMode, onToggleTheme }) {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [avatar, setAvatar] = useState('');
  const router = useRouter();
  useEffect(() => {
    if (user) {
      const saved = JSON.parse(localStorage.getItem('userProfile') || '{}');
      setAvatar(saved.avatar || '');
    }
  }, [user]);
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Traders', href: '/traders' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Profile', href: '/profile' },
  ];
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" role="navigation" aria-label="Main navigation">
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            CopyTrading App
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <IconButton color="inherit" onClick={onToggleTheme} sx={{ mr: 1 }} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {navLinks.map(link => (
              <Button
                key={link.href}
                color="inherit"
                component={Link}
                href={link.href}
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                aria-label={link.label}
                aria-current={router.pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Button>
            ))}
            {user && (
              <>
                <Avatar src={avatar} sx={{ width: 32, height: 32, ml: 2, mr: 1 }} alt="User avatar" />
                <Button color="inherit" onClick={logout} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} aria-label="Logout">
                  Logout
                </Button>
              </>
            )}
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <IconButton color="inherit" onClick={onToggleTheme} sx={{ mr: 1 }} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu">
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} aria-label="Mobile navigation menu">
              <List sx={{ width: 200 }}>
                {navLinks.map(link => (
                  <ListItem
                    button
                    key={link.href}
                    component={Link}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    aria-label={link.label}
                    aria-current={router.pathname === link.href ? 'page' : undefined}
                  >
                    <ListItemText primary={link.label} />
                  </ListItem>
                ))}
                {user && (
                  <ListItem button onClick={() => { logout(); setDrawerOpen(false); }} aria-label="Logout">
                    <ListItemText primary="Logout" />
                  </ListItem>
                )}
              </List>
            </Drawer>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
} 