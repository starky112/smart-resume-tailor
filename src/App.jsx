import { useState } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import StepsIndicator from './components/StepsIndicator'
import UploadZone from './components/UploadZone'
import ToneSelector from './components/ToneSelector'
import LoadingState from './components/LoadingState'
import ResultsPanel from './components/ResultsPanel'
import Toast from './components/Toast'
import Footer from './components/Footer'
import { useAnalyzer } from './hooks/useAnalyzer'

const DEMO_RESUME = `Alex Johnson | alex@email.com | linkedin.com/in/alexj | github.com/alexj

EXPERIENCE

Frontend Developer — WebWorks Agency (2022–2024)
- Developed 15+ client websites using React and TypeScript
- Built reusable component libraries reducing dev time by 30%
- Worked with REST APIs and integrated third-party services
- Used Git for version control and collaborated with 5-person team
- Improved page load times by 40% through code splitting

Junior Developer — Freelance (2020–2022)
- Created landing pages and portfolios for small businesses
- Used HTML, CSS, JavaScript for web development
- Basic experience with WordPress and PHP

SKILLS
JavaScript, React, TypeScript, HTML, CSS, Git, Node.js, REST APIs, Figma

EDUCATION
B.Sc Computer Science — State University (2020)`

const DEMO_JD = `Senior Frontend Engineer — TechVenture Inc.

About Us:
We're building next-gen fintech tools used by 500k+ users. We're looking for a skilled frontend engineer to own our core dashboard experience.

Responsibilities:
- Lead development of our React/TypeScript dashboard
- Build performant, accessible UI components
- Collaborate with design team on UX improvements
- Write unit and integration tests (Jest, React Testing Library)
- Contribute to technical architecture decisions
- Mentor junior developers

Requirements:
- 3+ years of React and TypeScript experience
- Strong understanding of state management (Redux, Zustand, or similar)
- Experience with testing frameworks (Jest, Cypress)
- Knowledge of web performance optimization
- Experience with CI/CD pipelines
- GraphQL experience preferred
- Accessibility (WCAG) knowledge
- Strong communication and leadership skills`

export default function App() {
  const [resumeText, setResumeText] = useState('')
  const [jdText, setJdText] = useState('')
  const [resumeMode, setResumeMode] = useState('upload')
  const [toast, setToast] = useState(null)
  const [error, setError] = useState('')
  const { step, loading, loadingStep, results, tone, setTone, runAnalysis, reset } = useAnalyzer()

  function showToast(msg, icon = '✓') {
    setToast({ msg, icon })
    setTimeout(() => setToast(null), 3000)
  }

  function loadDemo() {
    setResumeMode('paste')
    setResumeText(DEMO_RESUME)
    setJdText(DEMO_JD)
    setError('')
    showToast('Demo loaded! Click Analyze.', '✦')
  }

  async function handleAnalyze() {
    setError('')
    if (!resumeText.trim()) { setError('Please add your resume — upload a file or paste text.'); return }
    if (!jdText.trim()) { setError('Please paste the job description.'); return }
    await runAnalysis(resumeText, jdText)
  }

  function handleReset() {
    setResumeText('')
    setJdText('')
    setError('')
    reset()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <Header />
      <div className="app">
        <HeroSection />
        <StepsIndicator currentStep={step} />

        {!loading && !results && (
          <div id="input-section">
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-body">
                <div className="input-grid">
                  <div>
                    <label>Your Resume</label>
                    <div className="resume-input-toggle">
                      <button className={`toggle-btn${resumeMode === 'upload' ? ' active' : ''}`} onClick={() => setResumeMode('upload')}>⬆ Upload File</button>
                      <button className={`toggle-btn${resumeMode === 'paste' ? ' active' : ''}`} onClick={() => setResumeMode('paste')}>✎ Paste Text</button>
                    </div>
                    {resumeMode === 'upload' ? (
                      <UploadZone onTextExtracted={setResumeText} />
                    ) : (
                      <textarea
                        value={resumeText}
                        onChange={e => setResumeText(e.target.value)}
                        placeholder={`Paste your full resume here...\n\nInclude your work experience, skills, education, and any other relevant sections.\n\nExample:\nJohn Doe | john@email.com | linkedin.com/in/john\n\nEXPERIENCE\nSoftware Engineer — Acme Corp (2021–2024)\n• Built REST APIs using Node.js and Express\n• Managed PostgreSQL databases\n• Led team of 3 engineers...\n\nSKILLS\nJavaScript, React, Node.js, Python, SQL`}
                      />
                    )}
                  </div>
                  <div>
                    <label>Job Description</label>
                    <textarea
                      value={jdText}
                      onChange={e => setJdText(e.target.value)}
                      placeholder={`Paste the full job description here...\n\nInclude the job title, responsibilities, and requirements.\n\nExample:\nSenior Frontend Engineer — Startup Inc\n\nWe're looking for a skilled frontend engineer to join our team...\n\nRequirements:\n• 3+ years of React experience\n• TypeScript proficiency\n• Experience with REST APIs\n• Strong CSS skills...`}
                    />
                  </div>
                </div>

                <ToneSelector tone={tone} setTone={setTone} />

                <div className="action-bar">
                  <button className="btn-primary" onClick={handleAnalyze}>
                    <span>✦</span> Analyze & Tailor Resume
                  </button>
                  <button className="btn-secondary" onClick={loadDemo}>Try Demo</button>
                </div>

                {error && <div className="error-box visible">⚠ {error}</div>}
              </div>
            </div>
          </div>
        )}

        {loading && <LoadingState loadingStep={loadingStep} />}

        {results && !loading && (
          <ResultsPanel
            results={results}
            originalResume={resumeText}
            tone={tone}
            onReset={handleReset}
            showToast={showToast}
          />
        )}
      </div>
      <Footer />
      {toast && <Toast msg={toast.msg} icon={toast.icon} />}
    </div>
  )
}