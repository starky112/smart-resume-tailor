export default function ATSPanel({ ats, atsScore }) {
  const checks = [
    { label: 'Email found', val: ats.hasEmail },
    { label: 'Phone found', val: ats.hasPhone },
    { label: 'Bullet points', val: ats.hasBullets },
    { label: 'Metrics/numbers', val: ats.hasMetrics },
  ]
  return (
    <div>
      <div className="row g-2 mb-3">
        {checks.map(c => (
          <div key={c.label} className="col-6">
            <div className="p-2 rounded-2" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>{c.label}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: c.val ? 'var(--green)' : 'var(--red)' }}>
                {c.val ? '✓' : '✕'}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text2)' }}>
        Word count: <strong style={{ color: 'var(--text)' }}>{ats.wordCount}</strong>
        {ats.wordCount < 200 && <span style={{ color: 'var(--yellow)' }}> — too short</span>}
      </div>
    </div>
  )
}