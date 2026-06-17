import { useState } from 'react'

export default function TailoredResume({ text }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="d-flex justify-content-end mb-2">
        <button onClick={handleCopy} className="btn btn-sm"
          style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)', fontSize: 12 }}>
          {copied ? '✓ Copied!' : '⎘ Copy'}
        </button>
      </div>
      <pre className="rounded-2 p-3" style={{ background: 'var(--bg3)', fontSize: 13, lineHeight: 1.9, maxHeight: 400, overflowY: 'auto', whiteSpace: 'pre-wrap', color: 'var(--text2)', fontFamily: 'DM Sans, sans-serif' }}>
        {text}
      </pre>
    </div>
  )
}