import { useState } from 'react';
import { Users, Play, Plus, Trash2 } from 'lucide-react';

export default function SetupScreen({ onStart }) {
    const [mode, setMode] = useState('americano');
    const [playerInput, setPlayerInput] = useState('');
    const [players, setPlayers] = useState([]);
    const [pointsPerMatch, setPointsPerMatch] = useState(24);
    const [courtNames, setCourtNames] = useState({});

    const addPlayer = () => {
        if (!playerInput.trim()) return;
        setPlayers([...players, { id: crypto.randomUUID(), name: playerInput.trim(), score: 0, matchesPlayed: 0 }]);
        setPlayerInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') addPlayer();
    };

    const removePlayer = (id) => {
        setPlayers(players.filter(p => p.id !== id));
    };

    const handleCourtNameChange = (index, name) => {
        setCourtNames({ ...courtNames, [index + 1]: name });
    };

    const canStart = players.length >= 4 && players.length % 4 === 0;

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Tournament Setup</h2>

            {/* Mode Selection */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    className={`mode-btn ${mode === 'americano' ? 'active' : ''}`}
                    onClick={() => setMode('americano')}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: mode === 'americano' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: mode === 'americano' ? '#1a2e05' : 'var(--text-muted)',
                        border: 'none',
                        fontWeight: 'bold'
                    }}
                >
                    Americano
                </button>
                <button
                    className={`mode-btn ${mode === 'mexicano' ? 'active' : ''}`}
                    onClick={() => setMode('mexicano')}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: mode === 'mexicano' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: mode === 'mexicano' ? '#1a2e05' : 'var(--text-muted)',
                        border: 'none',
                        fontWeight: 'bold'
                    }}
                >
                    Mexicano
                </button>
            </div>

            {/* Player Input */}
            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                    Add Players ({players.length})
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        className="input-field"
                        value={playerInput}
                        onChange={(e) => setPlayerInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Player Name"
                    />
                    <button
                        onClick={addPlayer}
                        style={{
                            background: 'var(--accent)',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            width: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Plus color="white" />
                    </button>
                </div>
            </div>

            {/* Player List */}
            <div style={{ marginBottom: '2rem', maxHeight: '300px', overflowY: 'auto' }}>
                {players.map(p => (
                    <div key={p.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.03)',
                        marginBottom: '0.5rem',
                        borderRadius: 'var(--radius-sm)'
                    }}>
                        <span>{p.name}</span>
                        <button onClick={() => removePlayer(p.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
                {players.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                        No players added yet.
                    </div>
                )}
            </div>

            {/* Points Setting */}
            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                    Points per Match
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {[16, 24, 32].map(pts => (
                        <button
                            key={pts}
                            onClick={() => setPointsPerMatch(pts)}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)',
                                background: pointsPerMatch === pts ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                color: pointsPerMatch === pts ? '#1a2e05' : 'var(--text-muted)',
                                fontWeight: 'bold'
                            }}
                        >
                            {pts}
                        </button>
                    ))}
                    <input
                        type="number"
                        className="input-field"
                        style={{ width: '80px', textAlign: 'center' }}
                        value={pointsPerMatch}
                        onChange={(e) => setPointsPerMatch(Number(e.target.value))}
                    />
                </div>
            </div>

            {/* Court Naming */}
            {canStart && (
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                        Court Names
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {Array.from({ length: Math.floor(players.length / 4) }).map((_, i) => (
                            <input
                                key={i}
                                className="input-field"
                                placeholder={`Court ${i + 1}`}
                                value={courtNames[i + 1] || ''}
                                onChange={(e) => handleCourtNameChange(i, e.target.value)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Start Button */}
            <button
                className="btn-primary"
                disabled={!canStart}
                onClick={() => onStart(mode, players, pointsPerMatch, courtNames)}
                style={{ opacity: canStart ? 1 : 0.5, cursor: canStart ? 'pointer' : 'not-allowed' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Play size={20} />
                    Start Tournament
                </div>
            </button>

            {!canStart && players.length > 0 && (
                <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--danger)', fontSize: '0.9rem' }}>
                    Need multiple of 4 players (4, 8, 12...)
                </p>
            )}
        </div>
    );
}
