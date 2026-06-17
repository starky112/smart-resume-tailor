export function analyzeResume(resumeText, jdText, tone) {
  const resumeLower = resumeText.toLowerCase()
  const jdLower = jdText.toLowerCase()

  const stopWords = new Set(['the', 'and', 'or', 'a', 'an', 'to', 'of', 'in', 'for', 'with', 'on', 'is', 'are', 'be', 'will', 'you', 'we', 'our', 'your', 'as', 'at', 'by', 'from', 'that', 'this', 'have', 'has', 'it', 'its', 'not', 'but', 'their', 'they', 'can', 'who', 'what', 'when', 'where', 'how', 'all', 'must', 'may', 'other', 'more', 'into', 'also', 'each', 'both', 'than', 'up', 'if', 'so', 'do', 'about', 'over', 'after', 'been', 'would', 'could', 'should', 'role', 'team', 'work', 'looking', 'join', 'help', 'strong', 'experience', 'knowledge', 'ability', 'skills', 'skill', 'years', 'preferred', 'required', 'plus', 'good', 'great', 'excellent', 'including', 'such', 'etc'])

  const techPatterns = [
    /react\.?js|reactjs/gi, /node\.?js|nodejs/gi, /typescript/gi, /javascript/gi,
    /python/gi, /java\b/gi, /\.net\b/gi, /c\+\+/gi, /c#/gi, /rust\b/gi,
    /sql\b/gi, /nosql/gi, /mongodb/gi, /postgresql|postgres/gi, /mysql/gi,
    /aws\b/gi, /azure\b/gi, /docker/gi, /kubernetes|k8s/gi, /ci\/cd|cicd/gi,
    /git\b/gi, /rest api|restful/gi, /graphql/gi, /html5?/gi, /css3?/gi,
    /tailwind/gi, /bootstrap/gi, /redux/gi, /vue\.?js/gi, /angular/gi,
    /next\.?js/gi, /svelte/gi, /machine learning|ml\b/gi, /tensorflow/gi,
    /pytorch/gi, /agile\b/gi, /scrum\b/gi, /figma/gi, /jest\b/gi, /cypress\b/gi,
    /webpack/gi, /vite\b/gi, /linux\b/gi, /microservices/gi, /devops/gi, /bash\b/gi
  ]
  const techPhrases = []
  techPatterns.forEach(rx => {
    const m = jdText.match(rx)
    if (m) m.forEach(x => techPhrases.push(x.toLowerCase().trim()))
  })

  const jdWords = jdLower.match(/\b[a-z][a-z0-9+#./\-]{1,}\b/g) || []
  const jdCleaned = jdWords.filter(w => !stopWords.has(w) && w.length > 3)
  const wordFreq = {}
  jdCleaned.forEach(w => wordFreq[w] = (wordFreq[w] || 0) + 1)
  const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([w]) => w)
  const allKeywords = [...new Set([...techPhrases, ...topWords])].slice(0, 22)

  const keywordResults = allKeywords.map(kw => {
    const kl = kw.toLowerCase()
    if (resumeLower.includes(kl)) return { word: kw, status: 'present' }
    const root = kl.replace(/(ing|tion|ed|er|s|js|\.js)$/, '')
    if (root.length > 3 && resumeLower.includes(root)) return { word: kw, status: 'partial' }
    return { word: kw, status: 'missing' }
  })

  const presentCount = keywordResults.filter(k => k.status === 'present').length
  const partialCount = keywordResults.filter(k => k.status === 'partial').length
  const keywordScore = allKeywords.length
    ? Math.round(((presentCount + partialCount * 0.5) / allKeywords.length) * 100)
    : 50

  const jdYearsMatch = jdText.match(/(\d+)\+?\s*years?/i)
  const requiredYears = jdYearsMatch ? parseInt(jdYearsMatch[1]) : 0
  const resumeYearsMatches = resumeText.match(/(\d{4})[–\-—](\d{4}|present|current)/gi) || []
  let totalExpYears = 0
  resumeYearsMatches.forEach(m => {
    const p = m.match(/(\d{4})[–\-—](\d{4}|present|current)/i)
    if (p) {
      const s = parseInt(p[1])
      const e = p[2].match(/present|current/i) ? new Date().getFullYear() : parseInt(p[2])
      totalExpYears += Math.max(0, e - s)
    }
  })
  const expScore = requiredYears > 0
    ? Math.min(100, Math.round((totalExpYears / requiredYears) * 80) + 20)
    : totalExpYears > 0 ? 75 : 50

  const techSkillWords = ['javascript', 'typescript', 'python', 'react', 'node', 'css', 'html', 'sql', 'git', 'api', 'aws', 'docker', 'java', 'angular', 'vue', 'mongodb', 'postgresql', 'redis', 'graphql', 'rest', 'agile', 'scrum', 'testing', 'figma', 'webpack', 'vite', 'tailwind']
  const resumeSkills = techSkillWords.filter(s => resumeLower.includes(s))
  const jdSkills = techSkillWords.filter(s => jdLower.includes(s))
  const matchedSkills = resumeSkills.filter(s => jdSkills.includes(s))
  const skillScore = jdSkills.length > 0 ? Math.round((matchedSkills.length / jdSkills.length) * 100) : 70

  const matchScore = Math.round(keywordScore * 0.45 + expScore * 0.3 + skillScore * 0.25)
  const scoreLabel = matchScore >= 80 ? 'Excellent Match' : matchScore >= 65 ? 'Strong Match' : matchScore >= 50 ? 'Good Match' : matchScore >= 35 ? 'Fair Match' : 'Weak Match'
  const scoreDesc = matchScore >= 65
    ? 'Your resume aligns well with this role. A few targeted keyword additions could push your score higher.'
    : matchScore >= 45
      ? 'Your background partially matches this role. Adding missing keywords and quantifying achievements will strengthen your application.'
      : 'Significant gaps detected. Focus on highlighting transferable skills and incorporating the missing keywords.'

  const hasStructure = /experience|education|skills/i.test(resumeText)
  const hasBullets = resumeText.includes('•') || resumeText.includes('-') || resumeText.includes('*')
  const formatScore = Math.min(100, (hasStructure ? 40 : 0) + (hasBullets ? 30 : 0) + (resumeText.length > 300 ? 20 : 10) + (resumeText.length < 5000 ? 10 : 0))
  const readability = Math.min(100, 50 + (hasBullets ? 20 : 0) + (hasStructure ? 20 : 0) + (resumeText.split('\n').length > 10 ? 10 : 0))
  const density = keywordScore < 35 ? 'Low' : keywordScore < 65 ? 'Medium' : 'High'
  const atsPass = matchScore >= 65 ? 'Yes' : matchScore >= 45 ? 'Maybe' : 'No'

  const checkQuantified = r => {
    const m = r.match(/\d+%|\d+x|\$[\d,]+|\d+\s*(users|clients|projects|team|engineers|people|customers|apps|websites|features)/gi)
    return m ? Math.min(100, 20 + m.length * 16) : 20
  }

  const skillGaps = [
    { area: 'Keywords', score: keywordScore },
    { area: 'Experience', score: expScore },
    { area: 'Tech Skills', score: skillScore },
    { area: 'Formatting', score: formatScore },
    { area: 'Quantified', score: checkQuantified(resumeText) }
  ]

  const missing = keywordResults.filter(k => k.status === 'missing').map(k => k.word)
  const missingRequirements = []
  if (missing.length > 0) missingRequirements.push(`Missing key terms: ${missing.slice(0, 5).join(', ')}`)
  if (!resumeText.match(/\d+%|\d+x|\$[\d,]+|\d+ (users|clients|projects|team|engineers)/)) missingRequirements.push('No quantified achievements — add metrics (%, $, numbers) to bullet points')
  if (requiredYears > totalExpYears && totalExpYears > 0) missingRequirements.push(`JD requests ${requiredYears}+ years; resume shows ~${totalExpYears} years`)
  if (!resumeLower.includes('github') && jdLower.includes('github')) missingRequirements.push('GitHub profile not mentioned')
  if (jdLower.includes('test') && !resumeLower.match(/test|jest|cypress|unittest/)) missingRequirements.push('Testing experience not mentioned — required in this role')
  if (missingRequirements.length === 0) missingRequirements.push('No critical gaps found — focus on strengthening existing bullet points with metrics')

  const tailoredResume = rewriteResume(resumeText, keywordResults, tone, jdText)
  const tips = generateTips(resumeText, jdText, keywordResults, tone, matchScore)

  return {
    matchScore, scoreLabel, scoreDesc,
    keywordScore, experienceScore: expScore, skillScore,
    keywords: keywordResults, skillGaps, missingRequirements,
    ats: { readability, keywordDensity: density, formatScore, estimatedPass: atsPass },
    tailoredResume, tips
  }
}

function rewriteResume(resume, keywords, tone, jd) {
  const missing = keywords.filter(k => k.status === 'missing').map(k => k.word)
  const present = keywords.filter(k => k.status === 'present').map(k => k.word)
  const toneMap = {
    professional: { verbs: ['Developed', 'Implemented', 'Delivered', 'Managed', 'Collaborated', 'Engineered', 'Optimized', 'Established', 'Designed', 'Coordinated'], summary: 'results-driven professional' },
    aggressive: { verbs: ['Spearheaded', 'Drove', 'Owned', 'Transformed', 'Accelerated', 'Championed', 'Scaled', 'Executed', 'Disrupted', 'Pioneered'], summary: 'high-impact performer' },
    concise: { verbs: ['Built', 'Led', 'Created', 'Improved', 'Shipped', 'Integrated', 'Deployed', 'Launched', 'Reduced', 'Increased'], summary: 'focused and efficient contributor' },
    technical: { verbs: ['Engineered', 'Architected', 'Integrated', 'Configured', 'Optimized', 'Automated', 'Deployed', 'Debugged', 'Refactored', 'Implemented'], summary: 'technically strong engineer' }
  }
  const t = toneMap[tone] || toneMap.professional
  const weakVerbMap = { 'worked on': t.verbs[0], 'helped with': t.verbs[1], 'assisted': t.verbs[2], 'was responsible for': t.verbs[3], 'did': t.verbs[4], 'made': t.verbs[5], 'involved in': t.verbs[6], 'participated in': t.verbs[7], 'contributed to': t.verbs[8], 'handled': t.verbs[9 % t.verbs.length] }
  let result = resume
  Object.entries(weakVerbMap).forEach(([weak, strong]) => {
    const rx = new RegExp(`(^[•\\-\\*]\\s*)${weak}`, 'gim')
    result = result.replace(rx, (_, bullet) => bullet + strong)
  })
  const roleTitle = jd.match(/^([^\n]{5,60})/)?.[1]?.trim() || 'this role'
  const topPresentSkills = present.slice(0, 4).join(', ')
  const summarySection = `PROFESSIONAL SUMMARY\n${t.summary.charAt(0).toUpperCase() + t.summary.slice(1)} with hands-on experience in ${topPresentSkills || 'software development'}. Seeking to contribute to ${roleTitle} by leveraging strong problem-solving skills and a focus on delivering quality results.`
  const missingTech = missing.filter(k => k.length > 2).slice(0, 8)
  const skillsRx = /(SKILLS?[:\s\n]*)([^\n]+(?:\n(?![A-Z]{3})[^\n]+)*)/i
  const skillsMatch = result.match(skillsRx)
  if (skillsMatch && missingTech.length > 0) {
    const existingLine = skillsMatch[2].trimEnd()
    const newSkillsLine = existingLine.includes(',') ? existingLine + ', ' + missingTech.join(', ') : existingLine + '\n' + missingTech.join(', ')
    result = result.replace(skillsRx, skillsMatch[1] + newSkillsLine)
  } else if (missingTech.length > 0) {
    result += `\n\nKEY SKILLS\n${[...new Set([...present.slice(0, 5), ...missingTech])].join(', ')}`
  }
  result = result.replace(/^([•\-\*]\s*)([A-Z][^•\-\*\n]{20,}[^%\d\n])$/gm, line => line.match(/\d/) ? line : line.trimEnd() + ' (quantify with metrics)')
  if (!/SUMMARY|OBJECTIVE|PROFILE/i.test(result)) result = summarySection + '\n\n' + result
  return `[Tailored for: ${roleTitle}]\n${'─'.repeat(50)}\n\n` + result
}

function generateTips(resume, jd, keywords, tone, score) {
  const tips = []
  const rl = resume.toLowerCase()
  const missing = keywords.filter(k => k.status === 'missing')
  if (!resume.match(/\d+%|\d+x/)) tips.push('Add percentage or multiplier metrics to at least 3 bullet points (e.g., "improved load time by 40%")')
  if (missing.length > 3) tips.push(`Weave these missing keywords into your bullets: ${missing.slice(0, 4).map(k => k.word).join(', ')}`)
  if (!rl.includes('github') && !rl.includes('portfolio')) tips.push('Include your GitHub profile URL and/or portfolio link at the top')
  if (resume.length > 4000) tips.push('Resume may be too long — aim for 1 page (600–900 words) for fresher/junior roles')
  if (score < 50) tips.push('Add a 2-line professional summary at the top targeted specifically at this role')
  if (tone === 'technical') tips.push('For technical roles, list specific versions: React 18, Node.js 20, PostgreSQL 15, etc.')
  tips.push('Run your final resume through an ATS checker like Jobscan before submitting')
  return tips.slice(0, 5)
}

export function generateDiff(original, tailored) {
  const origLines = original.split('\n').filter(l => l.trim())
  const newLines = tailored.split('\n').filter(l => l.trim())
  const result = []
  const maxLen = Math.max(origLines.length, newLines.length)
  for (let i = 0; i < Math.min(maxLen, 60); i++) {
    const o = origLines[i] || ''
    const n = newLines[i] || ''
    if (o === n) result.push({ type: 'same', text: n })
    else if (!o) result.push({ type: 'add', text: n })
    else if (!n) result.push({ type: 'remove', text: o })
    else { result.push({ type: 'remove', text: o }); result.push({ type: 'add', text: n }) }
  }
  return result
}