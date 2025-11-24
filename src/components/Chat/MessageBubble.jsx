import React from "react";

export default function MessageBubble({
  role,
  text,
  payload,
  time,
  onImageClick,
  onChipClick,
}) {
  const isBot = role !== "user";

  const renderRichContent = () => {
    const rc = payload?.richContent;
    if (!Array.isArray(rc)) return null;
    const flat = rc.flat();

    return (
      <div className="rc-wrapper" style={{ display: "grid", gap: 8 }}>
        {flat.map((item, idx) => {
          if (!item || typeof item !== "object") return null;

          if (item.type === "info") {
            return (
              <div key={`info-${idx}`} className="rc-card">
                {item.title ? (
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    {item.title}
                  </div>
                ) : null}
                {item.subtitle ? (
                  <div style={{ opacity: 0.85, whiteSpace: "pre-wrap" }}>
                    {item.subtitle}
                  </div>
                ) : null}
              </div>
            );
          }

          if (item.type === "button") {
            const handle = () => {
              // Preferimos 'value' (comando estructurado). Si no, usamos el texto visible.
              const val = item.value || item.text || item.title || "";
              if (!val) return;

              if (item.link && /^https?:\/\//i.test(item.link)) {
                window.open(item.link, "_blank", "noopener,noreferrer");
              }
              onChipClick && onChipClick(val);
            };
            return (
              <button key={`btn-${idx}`} type="button" className="rc-btn" onClick={handle}>
                {item.text || item.title || "Abrir"}
              </button>
            );
          }

          if (item.type === "image" && item.rawUrl) {
            return (
              <img
                key={`img-${idx}`}
                src={item.rawUrl}
                alt={item.accessibilityText || ""}
                style={{
                  width: "100%",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.14)",
                  cursor: onImageClick ? "zoom-in" : "default",
                }}
                onClick={() => onImageClick && onImageClick(item.rawUrl)}
              />
            );
          }

          return null;
        })}
      </div>
    );
  };

  const hasContent = (text && text.trim()) || (payload && payload.richContent);
  if (!hasContent) return null;

  return (
    <div className={`row ${isBot ? "bot" : "user"}`}>
      <div className={`bubble ${isBot ? "bot" : "user"}`}>
        {text ? <div style={{ whiteSpace: "pre-wrap" }}>{text}</div> : null}
        {renderRichContent()}
        {time ? (
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              opacity: 0.6,
              textAlign: isBot ? "left" : "right",
            }}
          >
            {time}
          </div>
        ) : null}
      </div>
    </div>
  );
}