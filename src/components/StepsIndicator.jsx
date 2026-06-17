const STEPS = ['Paste inputs', 'AI analysis', 'Review results', 'Export']

export default function StepsIndicator({ currentStep }) {
  return (
    <div className="steps">
      {STEPS.map((label, i) => {
        const num = i + 1
        const cls = num === currentStep ? 'active' : num < currentStep ? 'done' : ''
        return (
          <span key={num} style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`step ${cls}`}>
              <span className="step-num">{num < currentStep ? '✓' : num}</span>
              {label}
            </div>
            {i < STEPS.length - 1 && <span className="step-divider">→</span>}
          </span>
        )
      })}
    </div>
  )
}