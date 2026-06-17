import { useState, useRef } from 'react'

export default function UploadZone({ onTextExtracted }) {
  const [dragover, setDragover] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [parsingMsg, setParsingMsg] = useState('')
  const [uploaded, setUploaded] = useState(null)
  const inputRef = useRef()

  async function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve()
      const s = document.createElement('script')
      s.src = src
      s.onload = resolve
      s.onerror = reject
      document.head.appendChild(s)
    })
  }

  async function extractPDF(file) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js')
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
    const buf = await file.arrayBuffer()
    const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise
    let text = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map(item => item.str).join(' ') + '\n'
    }
    return text
  }

  async function extractDOCX(file) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js')
    const buf = await file.arrayBuffer()
    const result = await window.mammoth.extractRawText({ arrayBuffer: buf })
    return result.value
  }

  async function extractTXT(file) {
    return new Promise((res, rej) => {
      const r = new FileReader()
      r.onload = e => res(e.target.result)
      r.onerror = () => rej(new Error('Could not read file'))
      r.readAsText(file)
    })
  }

  async function processFile(file) {
    const ext = file.name.split('.').pop().toLowerCase()
    const allowed = ['pdf', 'doc', 'docx', 'txt']
    if (!allowed.includes(ext)) { alert('Unsupported file type. Please upload PDF, DOCX, DOC, or TXT.'); return }

    setParsing(true)
    setParsingMsg('Reading ' + file.name + '…')
    setUploaded(null)

    try {
      let text = ''
      if (ext === 'pdf') text = await extractPDF(file)
      else if (ext === 'docx' || ext === 'doc') text = await extractDOCX(file)
      else text = await extractTXT(file)

      if (!text || text.trim().length < 30) throw new Error('Could not extract readable text. Try paste instead.')

      setUploaded({ name: file.name, words: Math.round(text.length / 5) })
      onTextExtracted(text.trim())
    } catch (err) {
      alert('Could not read file: ' + err.message)
    }
    setParsing(false)
  }

  function clearUpload() {
    setUploaded(null)
    onTextExtracted('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      {parsing && (
        <div className="upload-parsing visible">
          <div className="mini-spinner" />
          <span>{parsingMsg}</span>
        </div>
      )}
      {uploaded && (
        <div className="upload-status visible">
          <span>✓</span>
          <span>{uploaded.name} · {uploaded.words} words (approx)</span>
          <button className="clear-btn" onClick={clearUpload}>✕ Remove</button>
        </div>
      )}
      {!uploaded && !parsing && (
        <div
          className={`upload-zone${dragover ? ' dragover' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragover(true) }}
          onDragLeave={() => setDragover(false)}
          onDrop={e => { e.preventDefault(); setDragover(false); const f = e.dataTransfer.files[0]; if (f) processFile(f) }}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files[0]; if (f) processFile(f) }} />
          <div className="upload-zone-icon">📄</div>
          <div className="upload-zone-text">Drop your resume here or <span style={{ color: 'var(--accent2)' }}>click to browse</span></div>
          <div className="upload-zone-hint">Supports PDF, DOCX, DOC, TXT</div>
        </div>
      )}
    </div>
  )
}