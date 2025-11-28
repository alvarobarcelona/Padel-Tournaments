import { useState, useEffect } from 'react';
import { generateAmericanoRound, generateMexicanoRound } from '../utils/logic';
import MatchCard from './MatchCard';
import Standings from './Standings';
import { List, RefreshCw, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TournamentView({ mode, initialPlayers, pointsPerMatch, onExit }) {
    // History: Array of round objects { roundNum, matches, playersSnapshot }
    const [history, setHistory] = useState([]);
    const [currentRoundNum, setCurrentRoundNum] = useState(1);
    const [viewRoundNum, setViewRoundNum] = useState(1); // For navigation

    // Current state (mutable for the current active round)
    const [matches, setMatches] = useState([]);
    const [players, setPlayers] = useState(initialPlayers);
    const [showStandings, setShowStandings] = useState(false);

    // Initialize first round
    useEffect(() => {
        startRound(1, initialPlayers);
    }, []);

    const startRound = (roundNum, currentPlayers) => {
        let newMatches = [];
        if (mode === 'americano') {
            newMatches = generateAmericanoRound(currentPlayers);
        } else {
            newMatches = generateMexicanoRound(currentPlayers);
        }

        newMatches = newMatches.map(m => ({
            ...m,
            score1: Math.floor(pointsPerMatch / 2),
            score2: Math.ceil(pointsPerMatch / 2)
        }));

        setMatches(newMatches);
        setCurrentRoundNum(roundNum);
        setViewRoundNum(roundNum);
    };

    const handleScoreChange = (matchId, team, newScore) => {
        if (viewRoundNum === currentRoundNum) {
            setMatches(matches.map(m => {
                if (m.id !== matchId) return m;
                const score1 = newScore;
                const score2 = pointsPerMatch - newScore;
                return { ...m, score1, score2 };
            }));
        } else {
            // Editing a past round
            const roundIndex = viewRoundNum - 1;
            const targetRound = history[roundIndex];
            if (!targetRound) return;

            const updatedMatches = targetRound.matches.map(m => {
                if (m.id !== matchId) return m;
                const score1 = newScore;
                const score2 = pointsPerMatch - newScore;
                return { ...m, score1, score2 };
            });

            // Update history
            const newHistory = [...history];
            newHistory[roundIndex] = { ...targetRound, matches: updatedMatches };
            setHistory(newHistory);

            recalculateStandings(newHistory);
        }
    };

    const recalculateStandings = (historyData) => {
        // Re-build players scores from scratch
        const newPlayers = initialPlayers.map(p => ({
            ...p,
            score: 0,
            matchesPlayed: 0,
            wins: 0,
            draws: 0,
            losses: 0
        }));

        // Helper to update stats
        const updateStats = (matches) => {
            matches.forEach(m => {
                const score1 = m.score1;
                const score2 = m.score2;

                let result1 = 'draw'; // win, loss, draw
                if (score1 > score2) result1 = 'win';
                else if (score1 < score2) result1 = 'loss';

                // Team 1
                m.team1.forEach(pRef => {
                    const p = newPlayers.find(pl => pl.id === pRef.id);
                    if (p) {
                        p.score += score1;
                        p.matchesPlayed += 1;
                        if (result1 === 'win') p.wins += 1;
                        else if (result1 === 'loss') p.losses += 1;
                        else p.draws += 1;
                    }
                });

                // Team 2
                m.team2.forEach(pRef => {
                    const p = newPlayers.find(pl => pl.id === pRef.id);
                    if (p) {
                        p.score += score2;
                        p.matchesPlayed += 1;
                        if (result1 === 'loss') p.wins += 1; // If team 1 lost, team 2 won
                        else if (result1 === 'win') p.losses += 1;
                        else p.draws += 1;
                    }
                });
            });
        };

        historyData.forEach(round => updateStats(round.matches));

        setPlayers(newPlayers);
    };

    const finishRound = () => {
        // Save current round to history
        const newHistory = [...history, { roundNum: currentRoundNum, matches: [...matches] }];
        setHistory(newHistory);

        // Calculate updated players for next round generation
        const updatedPlayers = initialPlayers.map(p => ({
            ...p,
            score: 0,
            matchesPlayed: 0,
            wins: 0,
            draws: 0,
            losses: 0
        }));

        newHistory.forEach(round => {
            round.matches.forEach(m => {
                const score1 = m.score1;
                const score2 = m.score2;
                let result1 = 'draw';
                if (score1 > score2) result1 = 'win';
                else if (score1 < score2) result1 = 'loss';

                m.team1.forEach(pRef => {
                    const p = updatedPlayers.find(pl => pl.id === pRef.id);
                    if (p) {
                        p.score += score1;
                        p.matchesPlayed += 1;
                        if (result1 === 'win') p.wins += 1;
                        else if (result1 === 'loss') p.losses += 1;
                        else p.draws += 1;
                    }
                });
                m.team2.forEach(pRef => {
                    const p = updatedPlayers.find(pl => pl.id === pRef.id);
                    if (p) {
                        p.score += score2;
                        p.matchesPlayed += 1;
                        if (result1 === 'loss') p.wins += 1;
                        else if (result1 === 'win') p.losses += 1;
                        else p.draws += 1;
                    }
                });
            });
        });

        setPlayers(updatedPlayers);
        startRound(currentRoundNum + 1, updatedPlayers);
        window.scrollTo(0, 0);
    };

    // View Logic
    const activeMatches = viewRoundNum === currentRoundNum ? matches : history[viewRoundNum - 1]?.matches || [];

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <button onClick={onExit} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>Exit</button>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--primary)' }}>Round {viewRoundNum}</h2>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'capitalize' }}>{mode} Mode</span>
                </div>
                <button
                    onClick={() => setShowStandings(true)}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '10px', borderRadius: '50%', color: 'white' }}
                >
                    <Trophy size={20} />
                </button>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <button
                    onClick={() => setViewRoundNum(Math.max(1, viewRoundNum - 1))}
                    disabled={viewRoundNum === 1}
                    style={{ background: 'none', border: 'none', color: viewRoundNum > 1 ? 'white' : 'rgba(255,255,255,0.1)' }}
                >
                    <ChevronLeft size={30} />
                </button>
                <span style={{ fontWeight: 'bold' }}>
                    {viewRoundNum === currentRoundNum ? 'Current' : 'History'}
                </span>
                <button
                    onClick={() => setViewRoundNum(Math.min(currentRoundNum, viewRoundNum + 1))}
                    disabled={viewRoundNum === currentRoundNum}
                    style={{ background: 'none', border: 'none', color: viewRoundNum < currentRoundNum ? 'white' : 'rgba(255,255,255,0.1)' }}
                >
                    <ChevronRight size={30} />
                </button>
            </div>

            {/* Matches */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeMatches.map(m => (
                    <MatchCard
                        key={m.id}
                        match={m}
                        onScoreChange={handleScoreChange}
                        maxPoints={pointsPerMatch}
                    />
                ))}
            </div>

            {/* Actions */}
            {viewRoundNum === currentRoundNum && (
                <div style={{ marginTop: '2rem' }}>
                    <button className="btn-primary" onClick={finishRound}>
                        Finish Round & Next
                    </button>
                </div>
            )}

            {viewRoundNum !== currentRoundNum && (
                <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Viewing past round. Changes here update the leaderboard.
                </div>
            )}

            {/* Standings Modal */}
            {showStandings && (
                <Standings players={players} onClose={() => setShowStandings(false)} />
            )}
        </div>
    );
}
