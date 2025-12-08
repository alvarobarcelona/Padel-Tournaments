import { useState, useEffect } from "react";
import { Trophy, ArrowLeft, Trash2 } from "lucide-react";
import SetupScreen from "./components/SetupScreen";
import TournamentView from "./components/TournamentView";
import Standings from "./components/Standings";

function App() {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem("padel-gameState");
    return saved ? JSON.parse(saved) : "setup";
  });

  const [tournamentData, setTournamentData] = useState(() => {
    const saved = localStorage.getItem("padel-tournamentData");
    return saved
      ? JSON.parse(saved)
      : { mode: "americano", players: [], pointsPerMatch: 24, courtNames: {} };
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("padel-history");
    return saved ? JSON.parse(saved) : [];
  });

  const [viewHistoryItem, setViewHistoryItem] = useState(null);

  useEffect(() => {
    localStorage.setItem("padel-gameState", JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem(
      "padel-tournamentData",
      JSON.stringify(tournamentData)
    );
  }, [tournamentData]);

  useEffect(() => {
    localStorage.setItem("padel-history", JSON.stringify(history));
  }, [history]);

  const startTournament = (mode, players, pointsPerMatch, courtNames) => {
    setTournamentData({ mode, players, pointsPerMatch, courtNames });
    setGameState("playing");
  };

  const finishTournament = (finalPlayers, roundsHistory = []) => {
    const winner = [...finalPlayers].sort((a, b) => b.score - a.score)[0];
    const newRecord = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      mode: tournamentData.mode,
      winner: winner ? winner.name : "Unknown",
      players: finalPlayers,
      history: roundsHistory,
      courtNames: tournamentData.courtNames,
    };
    setHistory([newRecord, ...history]);
    setGameState("setup");
  };

  const deleteTournament = (e, id) => {
    e.stopPropagation(); // Prevent opening detail view
    if (confirm("Are you sure you want to delete this tournament?")) {
      setHistory(history.filter((h) => h.id !== id));
    }
  };

  return (
    <div>
      {gameState === "setup" ? (
        <div className="container">
          <header
            style={{
              textAlign: "center",
              marginBottom: "2rem",
              paddingTop: "2rem",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "12px",
                background: "rgba(163, 230, 53, 0.1)",
                borderRadius: "50%",
                marginBottom: "1rem",
              }}
            >
              <Trophy size={40} color="var(--primary)" />
            </div>
            <h1>Padel Tournament</h1>
            <p style={{ color: "var(--text-muted)" }}>
              Americano & Mexicano Manager
            </p>
          </header>

          <SetupScreen onStart={startTournament} />

          {history.length > 0 && (
            <div style={{ marginTop: "3rem" }}>
              <h3 style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
                Tournament History
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {history.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => setViewHistoryItem(record)}
                    style={{
                      background: "var(--card-bg)",
                      padding: "1rem",
                      borderRadius: "var(--radius)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid var(--border)",
                      cursor: "pointer",
                      transition: "transform 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.01)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <div>
                      <div style={{ fontWeight: "bold" }}>
                        {record.winner} 🏆
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {record.date} •{" "}
                        <span style={{ textTransform: "capitalize" }}>
                          {record.mode}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{ fontSize: "0.9rem", color: "var(--primary)" }}
                      >
                        {record.players.length} Players
                      </div>
                      <button
                        onClick={(e) => deleteTournament(e, record.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          padding: "5px",
                        }}
                        title="Delete Tournament"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewHistoryItem && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "var(--bg)",
                zIndex: 100,
                overflowY: "auto",
                padding: "2rem",
              }}
            >
              <button
                onClick={() => setViewHistoryItem(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  marginBottom: "2rem",
                  fontSize: "1rem",
                }}
              >
                <ArrowLeft size={20} /> Back
              </button>
              <h2 style={{ marginBottom: "1rem" }}>Tournament Results</h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
                {viewHistoryItem.date} • {viewHistoryItem.mode}
              </p>
              <Standings
                players={viewHistoryItem.players}
                history={viewHistoryItem.history || []}
                courtNames={viewHistoryItem.courtNames || {}}
                pointsPerMatch={24}
                onClose={() => setViewHistoryItem(null)}
              />
            </div>
          )}
        </div>
      ) : (
        <TournamentView
          mode={tournamentData.mode}
          initialPlayers={tournamentData.players}
          pointsPerMatch={tournamentData.pointsPerMatch}
          courtNames={tournamentData.courtNames}
          onExit={() => setGameState("setup")}
          onFinish={finishTournament}
        />
      )}
    </div>
  );
}

export default App;
