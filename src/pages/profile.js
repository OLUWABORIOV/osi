import NavBar from '../components/NavBar';
import { useAuth } from '../components/AuthContext';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function Profile() {
  const { user, login } = useAuth();

  if (!user) {
    let input;
    return (
      <>
        <NavBar />
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Login to view your profile</Typography>
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
      <NavBar />
      <main style={{ padding: 24 }}>
        <h1>Profile</h1>
        <p>Your profile and trading stats will appear here.</p>
      </main>
    </>
  );
} 