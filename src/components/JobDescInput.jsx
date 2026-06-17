export default function JobDescInput({ value, onChange }) {
  return (
    <div>
      <label className="form-label text-uppercase fw-500" style={{ fontSize: 12, color: 'var(--text2)', letterSpacing: '0.04em' }}>
        Job Description
      </label>
      <textarea
        className="form-control border-0 rounded-2"
        rows={10}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste the full job description here..."
        style={{ background: 'var(--bg3)', color: 'var(--text)', fontSize: 13, resize: 'vertical', outline: 'none' }}
      />
    </div>
  )
}