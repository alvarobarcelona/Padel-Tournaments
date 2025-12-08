import { useState, useEffect } from "react";
import { Users, Play, Plus, Trash2, Star, UserPlus } from "lucide-react";

export default function SetupScreen({ onStart }) {
  const [mode, setMode] = useState("americano");
  const [playerInput, setPlayerInput] = useState("");
  const [players, setPlayers] = useState([]);
  const [pointsPerMatch, setPointsPerMatch] = useState(24);
  const [courtNames, setCourtNames] = useState({});

  // Saved players management
  const [savedPlayers, setSavedPlayers] = useState(() => {
    const saved = localStorage.getItem("padel-savedPlayers");
    return saved ? JSON.parse(saved) : [];
  });
  const [showSavedPlayers, setShowSavedPlayers] = useState(true);

  // Save to localStorage whenever savedPlayers changes
  useEffect(() => {
    localStorage.setItem("padel-savedPlayers", JSON.stringify(savedPlayers));
  }, [savedPlayers]);

  const addPlayer = (saveToList = false) => {
    if (!playerInput.trim()) return;

    const newPlayer = {
      id: crypto.randomUUID(),
      name: playerInput.trim(),
      score: 0,
      matchesPlayed: 0,
    };

    setPlayers([...players, newPlayer]);

    // Optionally save to permanent list
    if (
      saveToList &&
      !savedPlayers.some(
        (p) => p.name.toLowerCase() === playerInput.trim().toLowerCase()
      )
    ) {
      setSavedPlayers([...savedPlayers, { name: playerInput.trim() }]);
    }

    setPlayerInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addPlayer(false);
  };

  const removePlayer = (id) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const removeSavedPlayer = (name) => {
    if (confirm(`Remove "${name}" from saved players?`)) {
      setSavedPlayers(savedPlayers.filter((p) => p.name !== name));
    }
  };

  const toggleSavedPlayer = (savedPlayerName) => {
    const isAlreadyAdded = players.some(
      (p) => p.name.toLowerCase() === savedPlayerName.toLowerCase()
    );

    if (isAlreadyAdded) {
      // Remove from tournament players
      setPlayers(
        players.filter(
          (p) => p.name.toLowerCase() !== savedPlayerName.toLowerCase()
        )
      );
    } else {
      // Add to tournament players
      const newPlayer = {
        id: crypto.randomUUID(),
        name: savedPlayerName,
        score: 0,
        matchesPlayed: 0,
      };
      setPlayers([...players, newPlayer]);
    }
  };

  const handleCourtNameChange = (index, name) => {
    setCourtNames({ ...courtNames, [index + 1]: name });
  };

  const canStart = players.length >= 4 && players.length % 4 === 0;

  return (
    <div
      className="glass-panel"
      style={{ padding: "1.5rem", maxWidth: "600px", margin: "0 auto" }}
    >
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        Tournament Setup
      </h2>

      {/* Mode Selection */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button
          className={`mode-btn ${mode === "americano" ? "active" : ""}`}
          onClick={() => setMode("americano")}
          style={{
            flex: 1,
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            background:
              mode === "americano"
                ? "var(--primary)"
                : "rgba(255,255,255,0.05)",
            color: mode === "americano" ? "#1a2e05" : "var(--text-muted)",
            border: "none",
            fontWeight: "bold",
          }}
        >
          Americano
        </button>
        <button
          className={`mode-btn ${mode === "mexicano" ? "active" : ""}`}
          onClick={() => setMode("mexicano")}
          style={{
            flex: 1,
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            background:
              mode === "mexicano" ? "var(--primary)" : "rgba(255,255,255,0.05)",
            color: mode === "mexicano" ? "#1a2e05" : "var(--text-muted)",
            border: "none",
            fontWeight: "bold",
          }}
        >
          Mexicano
        </button>
      </div>

      {/* Saved Players Quick Selection */}
      {savedPlayers.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <div
            onClick={() => setShowSavedPlayers(!showSavedPlayers)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
              cursor: "pointer",
              color: "var(--primary)",
              fontWeight: "bold",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Star size={18} fill="var(--primary)" />
              <span>Saved Players ({savedPlayers.length})</span>
            </div>
            <span style={{ fontSize: "0.8rem" }}>
              {showSavedPlayers ? "▼" : "▶"}
            </span>
          </div>

          {showSavedPlayers && (
            <div
              style={{
                background: "rgba(163, 230, 53, 0.05)",
                borderRadius: "var(--radius-sm)",
                padding: "0.75rem",
                border: "1px solid rgba(163, 230, 53, 0.2)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: "0.5rem",
                }}
              >
                {savedPlayers.map((savedPlayer) => {
                  const isSelected = players.some(
                    (p) =>
                      p.name.toLowerCase() === savedPlayer.name.toLowerCase()
                  );

                  return (
                    <div
                      key={savedPlayer.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        background: isSelected
                          ? "var(--primary)"
                          : "rgba(255,255,255,0.05)",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        position: "relative",
                        border: isSelected
                          ? "1px solid var(--primary)"
                          : "1px solid transparent",
                      }}
                      onClick={() => toggleSavedPlayer(savedPlayer.name)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        style={{
                          cursor: "pointer",
                          accentColor: "var(--primary)",
                        }}
                      />
                      <span
                        style={{
                          flex: 1,
                          fontSize: "0.9rem",
                          color: isSelected ? "#1a2e05" : "white",
                          fontWeight: isSelected ? "bold" : "normal",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {savedPlayer.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSavedPlayer(savedPlayer.name);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: isSelected ? "#1a2e05" : "var(--text-muted)",
                          padding: "2px",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        title="Remove from saved players"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Player Input */}
      <div style={{ marginBottom: "2rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "var(--text-muted)",
          }}
        >
          Add Players ({players.length})
        </label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            className="input-field"
            value={playerInput}
            onChange={(e) => setPlayerInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Player Name"
          />
          <button
            onClick={() => addPlayer(false)}
            style={{
              background: "var(--accent)",
              border: "none",
              borderRadius: "var(--radius-sm)",
              width: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Add player"
          >
            <Plus color="white" />
          </button>
          <button
            onClick={() => addPlayer(true)}
            style={{
              background: "var(--primary)",
              border: "none",
              borderRadius: "var(--radius-sm)",
              width: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Add and save to favorites"
          >
            <UserPlus color="#1a2e05" />
          </button>
        </div>
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            marginTop: "0.5rem",
          }}
        >
          Press Enter or{" "}
          <Plus
            size={12}
            style={{ display: "inline", verticalAlign: "middle" }}
          />{" "}
          to add. Use{" "}
          <UserPlus
            size={12}
            style={{ display: "inline", verticalAlign: "middle" }}
          />{" "}
          to save player to favorites.
        </p>
      </div>

      {/* Player List */}
      <div
        style={{ marginBottom: "2rem", maxHeight: "300px", overflowY: "auto" }}
      >
        {players.map((p) => (
          <div
            key={p.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.75rem",
              background: "rgba(255,255,255,0.03)",
              marginBottom: "0.5rem",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <span>{p.name}</span>
            <button
              onClick={() => removePlayer(p.id)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {players.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              padding: "1rem",
            }}
          >
            {savedPlayers.length > 0
              ? "Select players from saved list or add new ones"
              : "No players added yet."}
          </div>
        )}
      </div>

      {/* Points Setting */}
      <div style={{ marginBottom: "2rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "var(--text-muted)",
          }}
        >
          Points per Match
        </label>
        <div style={{ display: "flex", gap: "1rem" }}>
          {[16, 24, 32].map((pts) => (
            <button
              key={pts}
              onClick={() => setPointsPerMatch(pts)}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                background:
                  pointsPerMatch === pts
                    ? "var(--primary)"
                    : "rgba(255,255,255,0.05)",
                color: pointsPerMatch === pts ? "#1a2e05" : "var(--text-muted)",
                fontWeight: "bold",
              }}
            >
              {pts}
            </button>
          ))}
          <input
            type="number"
            className="input-field"
            style={{ width: "80px", textAlign: "center" }}
            value={pointsPerMatch}
            onChange={(e) => setPointsPerMatch(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Court Naming */}
      {canStart && (
        <div style={{ marginBottom: "2rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "var(--text-muted)",
            }}
          >
            Court Names
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
            }}
          >
            {Array.from({ length: Math.floor(players.length / 4) }).map(
              (_, i) => (
                <input
                  key={i}
                  className="input-field"
                  placeholder={`Court ${i + 1}`}
                  value={courtNames[i + 1] || ""}
                  onChange={(e) => handleCourtNameChange(i, e.target.value)}
                />
              )
            )}
          </div>
        </div>
      )}

      {/* Start Button */}
      <button
        className="btn-primary"
        disabled={!canStart}
        onClick={() => onStart(mode, players, pointsPerMatch, courtNames)}
        style={{
          opacity: canStart ? 1 : 0.5,
          cursor: canStart ? "pointer" : "not-allowed",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <Play size={20} />
          Start Tournament
        </div>
      </button>

      {!canStart && players.length > 0 && (
        <p
          style={{
            textAlign: "center",
            marginTop: "1rem",
            color: "var(--danger)",
            fontSize: "0.9rem",
          }}
        >
          Need multiple of 4 players (4, 8, 12...)
        </p>
      )}
    </div>
  );
}
