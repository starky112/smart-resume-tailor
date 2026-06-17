const TONES = ['professional', 'aggressive', 'concise', 'technical']

export default function ToneSelector({ tone, setTone }) {
  return (
    <div className="options-row">
      <label>Rewrite tone:</label>
      <div className="tone-group">
        {TONES.map(t => (
          <button key={t} className={`tone-btn${tone === t ? ' active' : ''}`} onClick={() => setTone(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}