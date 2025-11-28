import { useState, useEffect } from 'react'
import { Trophy } from 'lucide-react'
import SetupScreen from './components/SetupScreen'
import TournamentView from './components/TournamentView'

function App() {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('padel-gameState');
    return saved ? JSON.parse(saved) : 'setup';
  });
  
  const [tournamentData, setTournamentData] = useState(() => {
    const saved = localStorage.getItem('padel-tournamentData');
    return saved ? JSON.parse(saved) : { mode: 'americano', players: [], pointsPerMatch: 24 };
  });

  useEffect(() => {
    localStorage.setItem('padel-gameState', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem('padel-tournamentData', JSON.stringify(tournamentData));
  }, [tournamentData]);

  const startTournament = (mode, players, pointsPerMatch) => {
    setTournamentData({ mode, players, pointsPerMatch });
    setGameState('playing');
  };

  return (
    <div>
      {gameState === 'setup' ? (
        <div className="container">
          <header style={{ textAlign: 'center', marginBottom: '2rem', paddingTop: '2rem' }}>
            <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(163, 230, 53, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
              <Trophy size={40} color="var(--primary)" />
            </div>
            <h1>Padel Tournament</h1>
            <p style={{ color: 'var(--text-muted)' }}>Americano & Mexicano Manager</p>
          </header>

          <SetupScreen onStart={startTournament} />
        </div>
      ) : (
        <TournamentView
          mode={tournamentData.mode}
          initialPlayers={tournamentData.players}
          pointsPerMatch={tournamentData.pointsPerMatch}
          onExit={() => setGameState('setup')}
        />
      )}
    </div>
  )
}

export default App
