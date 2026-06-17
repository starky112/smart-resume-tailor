import { useState, useEffect } from 'react'
import { generateDiff } from '../utils/analyzeResume'

export default function ResultsPanel({ results, originalResume, tone, onReset, showToast }) {
  const [activeTab, setActiveTab] = useState('tailored')
  const [scoreDisplay, setScoreDisplay] = useState(0)
  const { matchScore, scoreLabel, scoreDesc, keywordScore, experienceScore, skillScore, keywords, skillGaps, missingRequirements, ats, tailoredResume, tips } = results

  useEffect(() => {
    let cur = 0
    const tick = setInterval(() => {
      cur = Math.min(cur + 2, matchScore)
      setScoreDisplay(cur)
      if (cur >= matchScore) clearInterval(tick)
    }, 20)
    return () => clearInterval(tick)
  }, [matchScore])

  const circumference = 289
  const offset = circumference - (matchScore / 100) * circumference
  const ringColor = matchScore >= 75 ? '#22c55e' : matchScore >= 50 ? 'url(#scoreGrad)' : '#ef4444'

  function copyResume() {
    navigator.clipboard.writeText(tailoredResume).then(() => showToast('Copied to clipboard!')).catch(() => showToast('Copy failed', '⚠'))
  }

  function downloadTxt() {
    const blob = new Blob([tailoredResume], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'tailored-resume.txt'
    document.body.appendChild(a); a.click()
    setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a) }, 200)
    showToast('Downloaded!', '⬇')
  }

  function printResume() {
    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const html = `<!DOCTYPE html><html><head><title>Tailored Resume</title><style>body{font-family:Georgia,serif;max-width:750px;margin:2rem auto;line-height:1.8;color:#111;font-size:14px;}pre{white-space:pre-wrap;font-family:Georgia,serif;}</style></head><body><pre>${esc(tailoredResume)}</pre><script>window.onload=function(){window.print();}<\/script></body></html>`
    const win = window.open('', '_blank', 'width=800,height=600')
    if (win) { win.document.open(); win.document.write(html); win.document.close() }
  }

  const diff = generateDiff(originalResume, tailoredResume)

  return (
    <div id="results" className="visible">
      <div className="score-section">
        <div className="score-ring">
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle cx="55" cy="55" r="46" fill="none" stroke={ringColor} strokeWidth="8"
              strokeLinecap="round" strokeDasharray={circumference}
              strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c6af7" /><stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="score-ring-text">
            <span className="score-num">{scoreDisplay}</span>
            <span className="score-pct">/ 100</span>
          </div>
        </div>
        <div className="score-details">
          <div>
            <div className="score-label">{scoreLabel}</div>
            <div className="score-desc">{scoreDesc}</div>
          </div>
          <div className="sub-scores">
            <div className="sub-score"><div className="sub-score-val" style={{ color: 'var(--accent2)' }}>{keywordScore}%</div><div className="sub-score-key">Keywords</div></div>
            <div className="sub-score"><div className="sub-score-val" style={{ color: 'var(--green)' }}>{experienceScore}%</div><div className="sub-score-key">Experience</div></div>
            <div className="sub-score"><div className="sub-score-val" style={{ color: 'var(--yellow)' }}>{skillScore}%</div><div className="sub-score-key">Skills</div></div>
          </div>
        </div>
      </div>

      <div className="results-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-icon" style={{ background: 'var(--accent-bg)' }}>🔍</div>
            <div><div className="card-title">Keyword Analysis</div><div className="card-sub">From the job description</div></div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, fontSize: 11 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--green)' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} /> Present</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--yellow)' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--yellow)', display: 'inline-block' }} /> Partial</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--red)' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }} /> Missing</span>
            </div>
            <div className="keyword-list">
              {keywords.map(k => (
                <span key={k.word} className={`keyword-tag ${k.status}`}>
                  {k.status === 'present' ? '✓' : k.status === 'partial' ? '~' : '✗'} {k.word}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon" style={{ background: 'var(--yellow-bg)' }}>📊</div>
            <div><div className="card-title">Skill Gap Analysis</div><div className="card-sub">How you rank per area</div></div>
          </div>
          <div className="card-body">
            {skillGaps.map(sg => {
              const color = sg.score >= 70 ? 'var(--green)' : sg.score >= 40 ? 'var(--accent)' : 'var(--red)'
              return (
                <div key={sg.area} className="bar-row">
                  <span className="bar-label">{sg.area}</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: sg.score + '%', background: color }} /></div>
                  <span className="bar-val">{sg.score}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="results-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-icon" style={{ background: 'var(--red-bg)' }}>⚡</div>
            <div><div className="card-title">Missing Requirements</div><div className="card-sub">Things to address or add</div></div>
          </div>
          <div className="card-body">
            <ul className="bullet-list">
              {missingRequirements.map((m, i) => (
                <li key={i} className="bullet-item"><span className="bullet-dot" /><span>{m}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon" style={{ background: 'var(--green-bg)' }}>🤖</div>
            <div><div className="card-title">ATS Simulation</div><div className="card-sub">Applicant Tracking System analysis</div></div>
          </div>
          <div className="card-body">
            <div className="ats-grid">
              <div className="ats-item"><div className="ats-item-title">Readability</div><div className="ats-item-val" style={{ color: 'var(--accent2)' }}>{ats.readability}/100</div><div className="ats-item-sub">Parsing ease</div></div>
              <div className="ats-item"><div className="ats-item-title">Keyword Density</div><div className="ats-item-val" style={{ color: 'var(--yellow)' }}>{ats.keywordDensity}</div><div className="ats-item-sub">Match frequency</div></div>
              <div className="ats-item"><div className="ats-item-title">Format Score</div><div className="ats-item-val" style={{ color: 'var(--green)' }}>{ats.formatScore}/100</div><div className="ats-item-sub">Structure quality</div></div>
              <div className="ats-item">
                <div className="ats-item-title">ATS Pass</div>
                <div className="ats-item-val" style={{ color: ats.estimatedPass === 'Yes' ? 'var(--green)' : ats.estimatedPass === 'Maybe' ? 'var(--yellow)' : 'var(--red)' }}>{ats.estimatedPass}</div>
                <div className="ats-item-sub">Estimated screening</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card full-card">
        <div className="card-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="card-icon" style={{ background: 'var(--accent-bg)' }}>✦</div>
            <div><div className="card-title">Tailored Resume</div><div className="card-sub">{tone.charAt(0).toUpperCase() + tone.slice(1)} tone · Optimized for this role</div></div>
          </div>
          <div className="tabs">
            {['tailored', 'diff', 'tips'].map(t => (
              <button key={t} className={`tab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body">
          {activeTab === 'tailored' && <div className="resume-output">{tailoredResume}</div>}
          {activeTab === 'diff' && (
            <div>
              <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10 }}>
                <span style={{ color: 'var(--green)' }}>■</span> Added &nbsp; <span style={{ color: 'var(--red)' }}>■</span> Removed
              </p>
              <div className="diff-container">
                {diff.map((line, i) => (
                  <span key={i} className={line.type === 'add' ? 'diff-add' : line.type === 'remove' ? 'diff-remove' : ''} style={line.type === 'same' ? { color: 'var(--text3)' } : {}}>
                    {line.type === 'add' ? '+ ' : line.type === 'remove' ? '- ' : ''}{line.text}{'\n'}
                  </span>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'tips' && (
            <ul className="bullet-list">
              {tips.map((tip, i) => (
                <li key={i} className="bullet-item"><span className="bullet-dot" style={{ background: 'var(--yellow)' }} /><span>{tip}</span></li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="export-bar">
        <div>
          <p><strong>Your tailored resume is ready.</strong> Copy it, or export for applications.</p>
          <p className="muted" style={{ marginTop: 4 }}>Tip: Review before submitting — AI output may need minor adjustments.</p>
        </div>
        <div className="export-btns">
          <button className="btn-secondary" onClick={copyResume}>📋 Copy Text</button>
          <button className="btn-secondary" onClick={downloadTxt}>⬇ Download .txt</button>
          <button className="btn-primary" onClick={printResume} style={{ padding: '10px 20px', fontSize: 13 }}>🖨 Print / Save PDF</button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button className="btn-secondary" onClick={onReset}>← Start Over</button>
      </div>
    </div>
  )
}