import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function RoundsHistory({ history, courtNames, pointsPerMatch }) {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3
        style={{
          color: "var(--text-muted)",
          marginBottom: "1rem",
          fontSize: "1.1rem",
          fontWeight: "bold",
        }}
      >
        Rounds Played
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {history.map((round) => {
          const totalMatches = round.matches?.length || 0;

          return (
            <div
              key={round.roundNum}
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                borderRadius: "var(--radius)",
                border: "1px solid rgba(163, 230, 53, 0.2)",
                overflow: "hidden",
              }}
            >
              {/* Round Header */}
              <div
                style={{
                  width: "100%",
                  background: "rgba(163, 230, 53, 0.1)",
                  border: "none",
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "white",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "1rem",
                      color: "var(--primary)",
                    }}
                  >
                    Round {round.roundNum}
                  </span>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    {totalMatches} {totalMatches === 1 ? "match" : "matches"}
                  </span>
                </div>
              </div>

              {/* Round Content - Always Visible */}
              {round.matches && (
                <div
                  style={{
                    padding: "0 1rem 1rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {round.matches.map((match, idx) => {
                    const isTeam1Winner = match.score1 > match.score2;
                    const isTeam2Winner = match.score2 > match.score1;

                    return (
                      <div
                        key={match.id || idx}
                        style={{
                          background: "rgba(0, 0, 0, 0.3)",
                          borderRadius: "8px",
                          padding: "0.75rem",
                          border: "1px solid rgba(255, 255, 255, 0.05)",
                          position: "relative",
                        }}
                      >
                        {match.court && (
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--accent)",
                              fontWeight: "bold",
                              marginBottom: "0.5rem",
                              textAlign: "center",
                            }}
                          >
                            {courtNames?.[match.court] ||
                              `Court ${match.court}`}
                          </div>
                        )}

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto 1fr",
                            gap: "0.75rem",
                            alignItems: "center",
                          }}
                        >
                          {/* Team 1 */}
                          <div
                            style={{
                              textAlign: "right",
                              opacity: isTeam2Winner ? 0.6 : 1,
                            }}
                          >
                            <div
                              style={{
                                fontSize: "0.85rem",
                                marginBottom: "0.25rem",
                              }}
                            >
                              {match.team1?.map((p) => p.name).join(" & ") ||
                                "Team 1"}
                            </div>
                            <div
                              style={{
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                color: isTeam1Winner
                                  ? "var(--primary)"
                                  : "white",
                              }}
                            >
                              {match.score1}
                            </div>
                          </div>

                          {/* VS */}
                          <div
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                            }}
                          >
                            VS
                          </div>

                          {/* Team 2 */}
                          <div
                            style={{
                              textAlign: "left",
                              opacity: isTeam1Winner ? 0.6 : 1,
                            }}
                          >
                            <div
                              style={{
                                fontSize: "0.85rem",
                                marginBottom: "0.25rem",
                              }}
                            >
                              {match.team2?.map((p) => p.name).join(" & ") ||
                                "Team 2"}
                            </div>
                            <div
                              style={{
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                color: isTeam2Winner
                                  ? "var(--primary)"
                                  : "white",
                              }}
                            >
                              {match.score2}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
