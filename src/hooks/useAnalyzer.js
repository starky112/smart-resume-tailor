import { useState } from 'react'
import { analyzeResume } from '../utils/analyzeResume'

export function useAnalyzer() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [results, setResults] = useState(null)
  const [tone, setTone] = useState('professional')

  async function runAnalysis(resumeText, jdText) {
    if (!resumeText.trim() || !jdText.trim()) return null
    setLoading(true)
    setResults(null)
    setStep(2)
    setLoadingStep(0)
    for (let i = 1; i <= 5; i++) {
      setLoadingStep(i)
      await new Promise(r => setTimeout(r, 700))
    }
    const data = analyzeResume(resumeText, jdText, tone)
    setResults(data)
    setLoading(false)
    setStep(3)
    return data
  }

  function reset() {
    setResults(null)
    setStep(1)
    setLoading(false)
    setLoadingStep(0)
  }

  return { step, loading, loadingStep, results, tone, setTone, runAnalysis, reset }
}