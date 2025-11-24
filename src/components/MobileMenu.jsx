export default function MobileMenu({ open, onClose, options = [], onSelect }) {
  if (!open) return null;
  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="lightbox-content" onClick={(e)=>e.stopPropagation()} style={{width:"min(92vw,420px)", height:"auto"}}>
        <h3 style={{margin:"6px 8px 10px"}}>Menú rápido</h3>
        <div style={{display:"flex", flexDirection:"column", gap:8, padding:"0 8px 8px"}}>
          {options.map(opt => (
            <button key={opt.value} className="qr-btn" onClick={() => { onSelect(opt.value); onClose(); }}>
              {opt.label}
            </button>
          ))}
        </div>
        <div className="lightbox-actions">
          <button className="primary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
