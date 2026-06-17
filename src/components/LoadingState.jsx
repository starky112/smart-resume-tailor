const STEPS = [
  'Reading resume and job description',
  'Extracting keywords and requirements',
  'Calculating match score',
  'Rewriting resume to match role',
  'Generating ATS analysis',
]

export default function LoadingState({ loadingStep }) {
  return (
    <div className="loading-state visible">
      <div className="spinner" />
      <p style={{ color: 'var(--text2)', fontSize: 14 }}>Analyzing your resume...</p>
      <ul className="loading-steps">
        {STEPS.map((label, i) => {
          const num = i + 1
          const isDone = num < loadingStep
          const isActive = num === loadingStep
          return (
            <li key={num} className={isDone ? 'done' : isActive ? 'active' : ''} style={{ opacity: num > loadingStep ? 0.3 : 1 }}>
              <span className={`dot${isActive ? ' pulse' : ''}`} />
              {label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}