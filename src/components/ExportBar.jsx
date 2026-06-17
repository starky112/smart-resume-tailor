export default function ExportBar({ onReset }) {
  return (
    <div className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-5 flex-wrap gap-3"
      style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
      <p className="mb-0" style={{ fontSize: 13, color: 'var(--text2)' }}>
        Analysis complete. <strong style={{ color: 'var(--text)' }}>Copy or print your tailored resume.</strong>
      </p>
      <div className="d-flex gap-2 flex-wrap">
        <button onClick={() => window.print()} className="btn btn-sm"
          style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)', fontSize: 13 }}>
          🖨 Print
        </button>
        <button onClick={onReset} className="btn btn-sm"
          style={{ background: 'var(--accent-bg)', color: 'var(--accent2)', border: '1px solid var(--accent-border)', fontSize: 13 }}>
          ↺ Start Over
        </button>
      </div>
    </div>
  )
}