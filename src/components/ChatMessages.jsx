// src/components/ChatMessages.jsx
import React from "react";

export default function ChatMessages({ items, onSend }) {
  return (
    <div className="space-y-3">
      {items.map((m, idx) => (
        <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
          {/* Texto plano */}
          {m.text && (
            <div
              className={`inline-block rounded-lg px-3 py-2 ${
                m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
              }`}
              style={{ whiteSpace: "pre-line" }}
            >
              {m.text}
            </div>
          )}

          {/* Rich content (tarjetas, imágenes, botones, chips) */}
          {m.payload?.richContent && (
            <div className="mt-2 grid gap-3">
              {m.payload.richContent.map((col, cidx) => (
                <div key={cidx} className="grid gap-2">
                  {col.map((rc, ridx) => {
                    // IMAGEN
                    if (rc.type === "image") {
                      return (
                        <div key={ridx} className="rounded-xl overflow-hidden border bg-white">
                          <img
                            src={rc.rawUrl}
                            alt={rc.accessibilityText || "Imagen"}
                            className="w-full h-auto block"
                            loading="lazy"
                          />
                        </div>
                      );
                    }

                    // INFO
                    if (rc.type === "info") {
                      return (
                        <div key={ridx} className="rounded-xl border p-3 bg-white shadow-sm">
                          {rc.title && <div className="font-semibold">{rc.title}</div>}
                          {rc.subtitle && (
                            <div className="text-sm text-gray-700" style={{ whiteSpace: "pre-line" }}>
                              {rc.subtitle}
                            </div>
                          )}
                        </div>
                      );
                    }

                    // BOTÓN (si trae link lo abrimos; si no, mandamos el texto como mensaje)
                    if (rc.type === "button") {
                      return (
                        <button
                          key={ridx}
                          className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
                          onClick={() => {
                            if (rc.link) {
                              window.open(rc.link, "_blank", "noopener,noreferrer");
                            } else {
                              onSend(rc.action || rc.postback || rc.text || rc.label || "");
                            }
                          }}
                          title={rc.link ? "Abrir enlace" : (rc.text || "")}
                        >
                          {rc.text || rc.label || "Abrir"}
                        </button>
                      );
                    }



                    // CHIPS (menús como “¿Deseas consultar otro?” y “Selecciona un trámite”)
                    if (rc.type === "chips" && Array.isArray(rc.options)) {
                      return (
                        <div key={ridx} className="flex flex-wrap gap-2">
                          {rc.options.map((opt, oidx) => (
                            <button
                              key={oidx}
                              className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
                              onClick={() => onSend(opt.event || opt.text || opt.label || "")}
                              title={opt.text || opt.label || ""}
                            >
                              {opt.text || opt.label || "Opción"}
                            </button>
                          ))}
                        </div>
                      );
                    }

                    if (rc.type === "divider") {
                      return <hr key={ridx} className="my-2 opacity-40" />;
                    }

                    return null;
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}