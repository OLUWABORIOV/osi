import NavBar from '../components/NavBar';
import { useAuth } from '../components/AuthContext';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Profile({ darkMode, onToggleTheme }) {
  const { user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [edit, setEdit] = useState(false);
  const avatarInput = useRef();

  useEffect(() => {
    if (user) {
      const saved = JSON.parse(localStorage.getItem('userProfile') || '{}');
      setUsername(saved.username || user.username);
      setAvatar(saved.avatar || '');
      setBio(saved.bio || '');
      setPassword(saved.password || '');
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('userProfile', JSON.stringify({ username, avatar, bio, password }));
    setEdit(false);
  };

  if (!user) {
    let input;
    return (
      <>
        <NavBar darkMode={darkMode} onToggleTheme={onToggleTheme} />
        <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
          <Typography variant="h5" sx={{ mb: 2, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>Login to view your profile</Typography>
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
      <NavBar darkMode={darkMode} onToggleTheme={onToggleTheme} />
      <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
        <Typography variant="h4" sx={{ mb: 2, fontSize: { xs: '1.5rem', sm: '2rem' } }}>Profile</Typography>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar src={avatar} sx={{ width: 80, height: 80, mb: 2 }} />
          <Typography variant="h6">{username}</Typography>
          {bio && <Typography color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>{bio}</Typography>}
          {password && <Typography color="text.secondary" sx={{ mt: 1 }}>Password: {'*'.repeat(password.length)}</Typography>}
        </Box>
        {edit ? (
          <form onSubmit={handleSave}>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              style={{ padding: 8, fontSize: 16, width: '100%', marginBottom: 16 }}
              required
            />
            <input
              ref={avatarInput}
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
              placeholder="Avatar URL (optional)"
              style={{ padding: 8, fontSize: 16, width: '100%', marginBottom: 16 }}
            />
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Short bio (optional)"
              style={{ padding: 8, fontSize: 16, width: '100%', marginBottom: 16, minHeight: 60 }}
            />
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password (demo only)"
                style={{ padding: 8, fontSize: 16, width: '100%' }}
              />
              <IconButton
                onClick={() => setShowPassword((show) => !show)}
                edge="end"
                size="small"
                style={{ position: 'absolute', right: 8, top: 8 }}
                tabIndex={-1}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 1 }}>Save</Button>
            <Button variant="outlined" color="secondary" fullWidth onClick={() => setEdit(false)}>Cancel</Button>
          </form>
        ) : (
          <Button variant="outlined" color="primary" fullWidth onClick={() => setEdit(true)}>Edit Profile</Button>
        )}
      </Container>
    </>
  );
} 