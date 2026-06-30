import { useEffect, useRef, useState } from 'react'

export default function EntryOverlay({ isOpen, onClose, onSave }) {
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [hasPhoto, setHasPhoto] = useState(false)
  const [hasHand, setHasHand] = useState(false)
  const [dateLabel, setDateLabel] = useState('오늘 11:47')
  const [dateOpen, setDateOpen] = useState(false)
  const [handOpen, setHandOpen] = useState(false)
  const [isComposing, setIsComposing] = useState(false)

  function submit() {
    onSave({ text: text.trim(), name: name.trim(), hasPhoto, hasHand })
    setText('')
    setName('')
    setHasPhoto(false)
    setHasHand(false)
  }

  return (
    <section className={`entry-overlay ${isOpen ? 'active' : ''} ${isComposing ? 'composing' : ''}`}>
      <div className="entry-shell">
        <div className="entry-bar refined-entry-bar">
          <button type="button" className="back" onClick={onClose}>
            ‹
          </button>
          <button type="button" className="entry-date-btn refined-date" onClick={() => setDateOpen(true)}>
            {dateLabel} ›
          </button>
          <button type="button" className="done" onClick={submit}>
            완료
          </button>
        </div>
        <div className="entry-scroll">
          <div className="compose-card">
            <div className="textarea-wrap">
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                onFocus={() => setIsComposing(true)}
                onBlur={() => setIsComposing(false)}
                placeholder={`스친 일, 생각, 해야 할 일,
사진 한 장, 손으로 남긴 흔적.

한 단어여도 괜찮아요.`}
              ></textarea>
              <div className="compose-maeumi" aria-hidden="true">
                <img className="compose-maeumi-img" src="./maeumi-base.svg" alt="" />
                <span className="compose-maeumi-dot"></span>
              </div>
            </div>
            {hasPhoto && (
              <div className="attach-preview show">
                <div className="photo-preview">사진</div>
                <div className="attach-caption">사진을 함께 남겨요.</div>
              </div>
            )}
            {hasHand && (
              <div className="attach-preview show">
                <div className="handwrite-preview">
                  <svg width="140" height="70" viewBox="0 0 140 70" fill="none">
                    <path d="M8 40C30 15 55 54 80 27C95 12 110 19 126 31" stroke="#72D091" strokeWidth="5" strokeLinecap="round" />
                    <path d="M38 55C63 46 78 49 103 58" stroke="#62B3FF" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="attach-caption">손으로 남긴 흔적을 함께 남겨요.</div>
              </div>
            )}
          </div>
          <div className="completion-area">
            <div className="name-field">
              <label>이 순간의 이름은?</label>
              <span className="desc">글보다 먼저 떠오르는 이름이 있다면 붙여주세요. 선택사항이에요.</span>
              <div className="name-input-wrap">
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="예: 좋은 저녁, 괜찮아지는 중" />
              </div>
            </div>
            <p className="entry-help">마음 이름은 나중에 툭로그와 요즘 탭에서 다시 찾는 단서가 돼요.</p>
          </div>
        </div>
        <div className="entry-dock">
          <div className="tool-row">
            <button type="button" className={`tool-pill ${hasPhoto ? 'active' : ''}`} onClick={() => setHasPhoto((value) => !value)}>
              <span className="symbol">▧</span>
              <span className="label">사진</span>
            </button>
            <button type="button" className={`tool-pill ${hasHand ? 'active' : ''}`} onClick={() => setHandOpen(true)}>
              <span className="symbol">〰</span>
              <span className="label">손으로</span>
            </button>
          </div>
          <div className="dock-note">먼저 적고, 나중에 사진·손으로·이름을 붙여요.</div>
        </div>
      </div>
      <DateSheet
        isOpen={dateOpen}
        selected={dateLabel}
        onSelect={(value) => {
          setDateLabel(value)
          setDateOpen(false)
        }}
        onClose={() => setDateOpen(false)}
      />
      <HandSheet
        isOpen={handOpen}
        onClose={() => setHandOpen(false)}
        onAttach={() => {
          setHasHand(true)
          setHandOpen(false)
        }}
      />
    </section>
  )
}

function DateSheet({ isOpen, selected, onSelect, onClose }) {
  const options = ['오늘 11:47', '어제 21:30', '5월 18일 19:10']
  return (
    <section className={`date-sheet ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className="date-panel" onClick={(event) => event.stopPropagation()}>
        <div className="date-handle"></div>
        <h3 className="date-title">남긴 날짜</h3>
        <div className="date-options">
          {options.map((option) => (
            <button type="button" className={`date-option ${selected === option ? 'active' : ''}`} key={option} onClick={() => onSelect(option)}>
              {option.split(' ')[0]} <span>{option}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function HandSheet({ isOpen, onClose, onAttach }) {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const historyRef = useRef([])
  const drawingRef = useRef(false)
  const [brush, setBrush] = useState('#111')
  const [isEraser, setIsEraser] = useState(false)
  const colors = ['#111', '#72D091', '#FFD23F', '#62B3FF']

  useEffect(() => {
    if (!isOpen) return
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const ratio = window.devicePixelRatio || 1
    canvas.width = Math.max(1, Math.floor(rect.width * ratio))
    canvas.height = Math.max(1, Math.floor(rect.height * ratio))
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    contextRef.current = context
  }, [isOpen])

  function point(event) {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  function saveHistory() {
    const canvas = canvasRef.current
    if (!canvas) return
    historyRef.current = [...historyRef.current.slice(-12), canvas.toDataURL()]
  }

  function startDrawing(event) {
    const context = contextRef.current
    if (!context) return
    saveHistory()
    drawingRef.current = true
    const nextPoint = point(event)
    context.beginPath()
    context.moveTo(nextPoint.x, nextPoint.y)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function draw(event) {
    const context = contextRef.current
    if (!drawingRef.current || !context) return
    const nextPoint = point(event)
    context.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over'
    context.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : brush
    context.lineWidth = isEraser ? 22 : 6
    context.lineTo(nextPoint.x, nextPoint.y)
    context.stroke()
  }

  function stopDrawing() {
    drawingRef.current = false
    contextRef.current?.closePath()
  }

  function undo() {
    const canvas = canvasRef.current
    const context = contextRef.current
    const previous = historyRef.current.pop()
    if (!canvas || !context || !previous) return
    const image = new Image()
    image.onload = () => {
      const rect = canvas.getBoundingClientRect()
      context.clearRect(0, 0, rect.width, rect.height)
      context.drawImage(image, 0, 0, rect.width, rect.height)
    }
    image.src = previous
  }

  function clearCanvas() {
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!canvas || !context) return
    saveHistory()
    const rect = canvas.getBoundingClientRect()
    context.clearRect(0, 0, rect.width, rect.height)
  }

  function pickColor(color) {
    setBrush(color)
    setIsEraser(false)
  }

  return (
    <section className={`hand-modal ${isOpen ? 'show' : ''}`}>
      <div className="hand-panel">
        <div className="hand-top">
          <button type="button" className="x" onClick={onClose}>
            ×
          </button>
          <div className="title">손으로 남기기</div>
          <button type="button" className="attach" onClick={onAttach}>
            붙이기
          </button>
        </div>
        <div className="hand-canvas-wrap">
          <div className="hand-hint">글씨도, 낙서도, 그림도 괜찮아요</div>
          <canvas
            ref={canvasRef}
            className="hand-canvas"
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={stopDrawing}
          />
        </div>
        <div className="hand-tools">
          <button type="button" className="hand-tool-icon" onClick={undo} aria-label="되돌리기">
            ↶
          </button>
          <button type="button" className="hand-tool-icon" onClick={clearCanvas} aria-label="전체 지우기">
            ⌫
          </button>
          {colors.map((color) => (
            <button
              type="button"
              className={`hand-color ${!isEraser && brush === color ? 'active' : ''}`}
              style={{ background: color }}
              key={color}
              onClick={() => pickColor(color)}
              aria-label={`${color} 색상 선택`}
            ></button>
          ))}
          <button type="button" className={`eraser-btn ${isEraser ? 'active' : ''}`} onClick={() => setIsEraser(true)}>
            지우개
          </button>
        </div>
      </div>
    </section>
  )
}
