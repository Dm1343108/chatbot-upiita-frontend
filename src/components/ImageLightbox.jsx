import { useEffect } from "react";

export default function ImageLightbox({ src, alt = "mapa", onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!src) return null;

  const download = () => {
    const a = document.createElement("a");
    a.href = src;
    a.download = src.split("/").pop() || "mapa.jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const openNew = () => window.open(src, "_blank", "noopener,noreferrer");

  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <div className="viewer-body">
          <img src={src} alt={alt} className="lightbox-img" />
        </div>
        <div className="lightbox-actions">
          <button className="ghost" onClick={openNew}>Abrir en pestaña</button>
          
          <button className="primary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}