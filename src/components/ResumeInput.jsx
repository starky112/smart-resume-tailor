export default function ResumeInput({ value, onChange }) {
  return (
    <div>
      <label className="form-label text-uppercase fw-500" style={{ fontSize: 12, color: 'var(--text2)', letterSpacing: '0.04em' }}>
        Your Resume
      </label>
      <textarea
        className="form-control border-0 rounded-2"
        rows={10}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste your full resume here..."
        style={{ background: 'var(--bg3)', color: 'var(--text)', fontSize: 13, resize: 'vertical', outline: 'none' }}
      />
    </div>
  )
}