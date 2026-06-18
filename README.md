# ✦ ResumeAI — Smart Resume Tailor

> A browser-based resume optimization tool that analyzes your resume against any job description and instantly returns a match score, missing keyword analysis, ATS simulation, and a fully rewritten, tailored resume — with zero external AI API calls.

**[🔗 Live Demo](https://starky112.github.io/smart-resume-tailor/)** · **[📂 Source Code](https://github.com/starky112/smart-resume-tailor)**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&labelColor=20232a)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white&labelColor=20232a)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white&labelColor=20232a)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white&labelColor=20232a)
![No API](https://img.shields.io/badge/AI%20API-None%20Used-22c55e)
![License](https://img.shields.io/badge/License-MIT-555568)

---

## Why I Built This

Most "AI resume tailoring" tools online are thin wrappers around a paid LLM API — they break the moment a usage quota runs out, and they send a user's personal resume data to a third-party server. I wanted to prove the same outcome is achievable with a **deterministic, fully client-side rules engine**: real keyword extraction via regex/NLP heuristics, real ATS scoring logic, real resume rewriting — no API key, no backend, no data leaving the browser.

This project is one of two flagship pieces in my portfolio (the second being an [AI Mock Interview Coach](https://starky112.github.io/mock-interview-coach)), both built on the same principle: **production-quality UX, zero external dependency on paid AI services.**

---

## Features

**Dual input modes** — Upload a resume directly as PDF, DOCX, DOC, or TXT (parsed client-side via PDF.js and Mammoth.js), or paste resume text manually. No file ever touches a server.

**Keyword intelligence engine** — Extracts technical keywords from the job description using a curated regex pattern library (50+ tech terms) combined with frequency-based natural language extraction, then classifies each as Present, Partial, or Missing against the resume.

**Multi-factor match scoring** — Computes a weighted score (45% keyword match, 30% experience alignment, 25% skill overlap) with a live animated SVG progress ring, rather than a single arbitrary number.

**ATS simulation panel** — Estimates how an Applicant Tracking System would actually parse the resume: readability score, keyword density tier, formatting score, and a pass/fail/maybe verdict — based on real ATS heuristics (bullet structure, section headers, contact info detection, quantified achievement detection).

**Skill gap visualization** — Breaks down performance across five dimensions (Keywords, Experience, Tech Skills, Formatting, Quantified Achievements) with animated progress bars.

**Tone-adaptive resume rewriting** — Rewrites weak action verbs ("worked on", "helped with") into stronger, tone-specific verbs across four selectable tones (Professional, Aggressive, Concise, Technical), injects missing keywords into the skills section, and flags bullet points lacking quantified metrics.

**Side-by-side diff view** — Shows exactly what was added or changed between the original and tailored resume, line by line.

**Actionable tips engine** — Generates specific, prioritized recommendations (e.g. "add GitHub link", "quantify 3 more bullets") based on the actual gaps detected — not generic advice.

**Export options** — Copy to clipboard, download as `.txt`, or print/save as PDF directly from the browser.

**Try Demo** — One-click sample data load so reviewers can test the full flow in seconds without needing their own resume.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Custom CSS design system (dark theme, CSS variables) + Tailwind CSS + Bootstrap |
| File Parsing | PDF.js (PDF extraction), Mammoth.js (DOCX extraction) |
| Logic Engine | Pure JavaScript — regex-based keyword extraction, weighted scoring algorithms, rule-based resume rewriting |
| Deployment | GitHub Pages via `gh-pages` |
| AI / API Usage | **None.** All analysis runs synchronously in the browser. |

---

## Architecture

The app is structured as a clean component tree with logic fully separated from presentation:

```
src/
├── components/
│   ├── Header.jsx              Sticky nav bar
│   ├── HeroSection.jsx         Landing headline
│   ├── StepsIndicator.jsx      4-step progress tracker
│   ├── UploadZone.jsx          Drag/drop + PDF/DOCX parsing
│   ├── ToneSelector.jsx        Tone selection pills
│   ├── LoadingState.jsx        Animated multi-step loader
│   ├── ResultsPanel.jsx        Score ring, keyword grid, ATS panel, tabs
│   ├── Toast.jsx                Notification system
│   └── Footer.jsx
├── hooks/
│   └── useAnalyzer.js          Analysis state machine (step, loading, results)
├── utils/
│   └── analyzeResume.js        Core engine: keyword extraction, scoring,
│                                resume rewriting, diff generation
├── App.jsx                     Root composition + demo data
├── main.jsx
└── index.css                   Design system (CSS variables, components)
```

The analysis engine (`analyzeResume.js`) is intentionally decoupled from React — it's pure functions that take resume text, JD text, and a tone string, and return a structured result object. This makes it independently testable and reusable outside the UI layer.

---

## Running Locally

```bash
git clone https://github.com/starky112/smart-resume-tailor.git
cd smart-resume-tailor
npm install
npm run dev
```

Open `http://localhost:5173`.

## Building & Deploying

```bash
npm run build      # outputs to /dist
npm run deploy      # builds and pushes /dist to the gh-pages branch
```

---

## What I'd Improve Next

- Replace the regex-based keyword extraction with a lightweight client-side NLP library (e.g. compromise.js) for better phrase-boundary detection
- Add resume section reordering suggestions based on JD priority signals
- Persist analysis history locally (IndexedDB) so users can compare multiple tailored versions
- Add unit tests for the scoring engine (`analyzeResume.js` is the highest-value test target given it's pure logic)

---

## Author

**Akash K**
