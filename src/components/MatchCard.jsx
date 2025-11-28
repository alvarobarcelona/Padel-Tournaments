import { Minus, Plus } from 'lucide-react';

export default function MatchCard({ match, onScoreChange, maxPoints, courtName }) {

    const handleSliderChange = (e) => {
        const val = Number(e.target.value);
        onScoreChange(match.id, 1, val);
    };

    return (
        <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', position: 'relative' }}>
            {match.court && (
                <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--accent)',
                    color: 'white',
                    padding: '2px 10px',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                }}>
                    {courtName || `Court ${match.court}`}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                {/* Team 1 */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem', minHeight: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {match.team1.map(p => <div key={p.id}>{p.name}</div>)}
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {match.score1}
                    </div>
                </div>

                <div style={{ padding: '0 1rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>VS</div>

                {/* Team 2 */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem', minHeight: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {match.team2.map(p => <div key={p.id}>{p.name}</div>)}
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
                        {match.score2}
                    </div>
                </div>
            </div>

            {/* Slider Control */}
            <div style={{ marginTop: '1rem', padding: '0 1rem' }}>
                <input
                    type="range"
                    min="0"
                    max={maxPoints}
                    value={match.score1}
                    onChange={handleSliderChange}
                    style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    <span>Team 1: {match.score1}</span>
                    <span>Total: {maxPoints}</span>
                    <span>Team 2: {match.score2}</span>
                </div>
            </div>
        </div>
    );
}
