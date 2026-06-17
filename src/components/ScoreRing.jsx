export default function ScoreRing({ score }) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? 'var(--green)' : score >= 45 ? 'var(--yellow)' : 'var(--red)'

  return (
    <div className="position-relative" style={{ width: 110, height: 110, flexShrink: 0 }}>
      <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="55" cy="55" r={radius} fill="none" stroke="var(--bg3)" strokeWidth="8" />
        <circle cx="55" cy="55" r={radius} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="position-absolute top-50 start-50 translate-middle text-center">
        <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: '2rem', lineHeight: 1, color }}>{score}</div>
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>/ 100</div>
      </div>
    </div>
  )
}