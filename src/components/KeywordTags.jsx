export default function KeywordTags({ present, missing, partial }) {
  return (
    <div>
      <div className="d-flex flex-wrap gap-2">
        {present.map(k => (
          <span key={k} className="badge rounded-pill px-3 py-1" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--green)', border: '1px solid rgba(34,197,94,0.2)', fontSize: 12 }}>✓ {k}</span>
        ))}
        {partial.map(k => (
          <span key={k} className="badge rounded-pill px-3 py-1" style={{ background: 'rgba(234,179,8,0.1)', color: 'var(--yellow)', border: '1px solid rgba(234,179,8,0.2)', fontSize: 12 }}>~ {k}</span>
        ))}
        {missing.map(k => (
          <span key={k} className="badge rounded-pill px-3 py-1" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 12 }}>✕ {k}</span>
        ))}
      </div>
    </div>
  )
}