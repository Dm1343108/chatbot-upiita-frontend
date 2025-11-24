export default function QuickReplies({ options = [], onSelect }) {
  return (
    <div className="qr-grid">
      {options.map((opt) => (
        <button
          key={opt.value}
          className="qr-btn"
          type="button"
          onClick={() => onSelect(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}