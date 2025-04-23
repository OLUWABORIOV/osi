import NavBar from '../components/NavBar';

export default function Home({ darkMode, onToggleTheme }) {
  return (
    <>
      <NavBar darkMode={darkMode} onToggleTheme={onToggleTheme} />
      <main style={{ padding: 24 }}>
        <h1>Welcome to the CopyTrading App</h1>
        <p>Discover top traders and copy their trades in stocks and crypto!</p>
      </main>
    </>
  );
} 