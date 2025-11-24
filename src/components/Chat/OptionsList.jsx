import React from "react";

export default function OptionsList({ options = [], onSelect }) {
  if (!options?.length) return null;

  const wrap = { display: "grid", gap: 8, width: "100%" };
  const item = {
    width: "100%",
    textAlign: "left",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 10,
    padding: "10px 12px",
    color: "inherit",
    cursor: "pointer",
  };

  return (
    <div style={wrap}>
      {options.map((op, i) => (
        <button
          key={`${op.value}-${i}`}
          type="button"
          style={item}
          onClick={() => onSelect?.(op.value)}
          title={op.label}
        >
          {op.label}
        </button>
      ))}
    </div>
  );
}
