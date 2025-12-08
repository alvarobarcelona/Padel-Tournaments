import React from "react";

export function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "var(--background)",
          padding: "1.5rem",
          borderRadius: "var(--radius)",
          minWidth: "280px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ marginBottom: "0.5rem" }}>{title}</h3>
        <p style={{ marginBottom: "1.2rem", color: "var(--text-muted)" }}>
          {message}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.8rem",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
              color: "green",
            }}
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "var(--radius)",
              background: "var(--danger)",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
