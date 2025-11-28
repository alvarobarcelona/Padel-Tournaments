import { Trophy, Medal, X } from 'lucide-react';

export default function Standings({ players, onClose }) {
    const sortedPlayers = [...players].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.wins !== a.wins) return b.wins - a.wins; // Tie breaker: Wins
        return b.matchesPlayed - a.matchesPlayed;
    });

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy size={20} color="#FFD700" fill="#FFD700" />; // Gold
        if (index === 1) return <Medal size={20} color="#C0C0C0" fill="#C0C0C0" />; // Silver
        if (index === 2) return <Medal size={20} color="#CD7F32" fill="#CD7F32" />; // Bronze
        return <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>{index + 1}</span>;
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.98)',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            padding: '2rem 1rem',
            overflowY: 'auto',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <style>
                {`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          .row-anim { animation: slideUp 0.4s ease-out backwards; }
        `}
            </style>

            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2>Final Results</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Live Standings</p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '8px', color: 'white' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    {/* Table Header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 1fr 1.5fr',
                        padding: '1rem',
                        background: 'rgba(0,0,0,0.2)',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        <span>#</span>
                        <span style={{ textAlign: 'left' }}>PLAYER</span>
                        <span>MP</span>
                        <span>W</span>
                        <span>D</span>
                        <span>L</span>
                        <span>PTS</span>
                    </div>

                    {sortedPlayers.map((p, index) => (
                        <div
                            key={p.id}
                            className="row-anim"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 1fr 1.5fr',
                                alignItems: 'center',
                                padding: '1rem',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                background: index < 3 ? `rgba(163, 230, 53, ${0.15 - (index * 0.05)})` : 'transparent',
                                animationDelay: `${index * 0.05}s`,
                                textAlign: 'center',
                                fontSize: '0.9rem'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                {getRankIcon(index)}
                            </div>

                            <div style={{ textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {p.name}
                            </div>

                            <div style={{ color: 'var(--text-muted)' }}>{p.matchesPlayed || 0}</div>
                            <div style={{ color: 'var(--primary)' }}>{p.wins || 0}</div>
                            <div style={{ color: 'var(--text-muted)' }}>{p.draws || 0}</div>
                            <div style={{ color: 'var(--danger)' }}>{p.losses || 0}</div>

                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>
                                {p.score}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
