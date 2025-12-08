import { Trophy } from "lucide-react";

export default function RoundResults({
  roundNum,
  matches,
  pointsPerMatch,
  courtNames,
}) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          padding: "1rem",
          background: "rgba(163, 230, 53, 0.1)",
          borderRadius: "var(--radius)",
          border: "1px solid rgba(163, 230, 53, 0.3)",
        }}
      >
        <h3 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>
          Round {roundNum} Results
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          {matches.length} {matches.length === 1 ? "match" : "matches"} played
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {matches.map((match) => {
          const isTeam1Winner = match.score1 > match.score2;
          const isTeam2Winner = match.score2 > match.score1;
          const isDraw = match.score1 === match.score2;

          return (
            <div
              key={match.id}
              className="glass-panel"
              style={{
                padding: "1rem",
                position: "relative",
                border: "1px solid rgba(163, 230, 53, 0.2)",
              }}
            >
              {match.court && (
                <div
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--accent)",
                    color: "white",
                    padding: "2px 10px",
                    borderRadius: "10px",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  {courtNames?.[match.court] || `Court ${match.court}`}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: match.court ? "0.5rem" : "0",
                }}
              >
                {/* Team 1 */}
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    opacity: isTeam2Winner ? 0.6 : 1,
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    {match.team1.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        {p.name}
                        {isTeam1Winner && (
                          <Trophy size={16} color="#FFD700" fill="#FFD700" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: isTeam1Winner ? "var(--primary)" : "white",
                    }}
                  >
                    {match.score1}
                  </div>
                </div>

                <div
                  style={{
                    padding: "0 1rem",
                    color: "var(--text-muted)",
                    fontWeight: "bold",
                  }}
                >
                  VS
                </div>

                {/* Team 2 */}
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    opacity: isTeam1Winner ? 0.6 : 1,
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    {match.team2.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        {p.name}
                        {isTeam2Winner && (
                          <Trophy size={16} color="#FFD700" fill="#FFD700" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: isTeam2Winner ? "var(--primary)" : "white",
                    }}
                  >
                    {match.score2}
                  </div>
                </div>
              </div>

              {isDraw && (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "0.5rem",
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                  }}
                >
                  Draw
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
