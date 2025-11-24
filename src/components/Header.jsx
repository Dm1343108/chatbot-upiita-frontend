import React from "react";

export default function Header({ onNewChat }) {
  return (
    <header
      className="header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            background: "#6c63ff",
            color: "#fff",
            fontWeight: 700,
            width: 36,
            height: 36,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            fontSize: 18,
          }}
        >
          U
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>Chatbot UPIITA</div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>
            Asistente de trámites estudiantiles
          </div>
        </div>
      </div>

      {/* Botón Nueva conversación */}
      <button
        type="button"
        onClick={onNewChat}
        style={{
          background: "#6c63ff",
          color: "#fff",
          fontWeight: 600,
          border: "none",
          borderRadius: 8,
          padding: "10px 16px",
          cursor: "pointer",
        }}
      >
        Nueva conversación
      </button>
    </header>
  );
}
