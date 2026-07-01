import { useEffect, useRef, useState } from 'react'

const PHOTO_MAX_SIZE = 1200

export default function EntryOverlay({ isOpen, onClose, onSave }) {
  const fileInputRef = useRef(null)
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [photoData, setPhotoData] = useState('')
  const [handData, setHandData] = useState('')
  const [dateLabel, setDateLabel] = useState('오늘 11:47')
  const [dateOpen, setDateOpen] = useState(false)
  const [handOpen, setHandOpen] = useState(false)
  const [isComposing, setIsComposing] = useState(false)

  const hasPhoto = Boolean(photoData)
  const hasHand = Boolean(handData)

  function resetComposer() {
    setText('')
    setName('')
    setPhotoData('')
    setHandData('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function submit() {
    onSave({
      text: text.trim(),
      name: name.trim(),
      hasPhoto,
      hasHand,
      photoData,
      handData,
    })
    resetComposer()
  }

  function choosePhoto() {
    fileInputRef.current?.click()
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const dataUrl = await readPhotoAsDataUrl(file)
    setPhotoData(dataUrl)
  }

  return (
    <section className={`entry-overlay ${isOpen ? 'active' : ''} ${isComposing ? 'composing' : ''}`}>
      <div className="entry-shell">
        <div className="entry-bar refined-entry-bar">
          <button type="button" className="back" onClick={onClose}>
            ×
          </button>
          <button type="button" className="entry-date-btn refined-date" onClick={() => setDateOpen(true)}>
            {dateLabel} ▾
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
                placeholder={`스친 일, 생각, 해야 할 일.
떠오른 만큼만 남겨보세요.`}
              ></textarea>
              <div className="compose-maeumi" aria-hidden="true">
                <img className="compose-maeumi-img" src="./maeumi-base.svg" alt="" />
                <span className="compose-maeumi-dot"></span>
              </div>
            </div>

            {hasPhoto && (
              <div className="attach-preview show">
                <img className="photo-preview-img" src={photoData} alt="첨부한 사진" />
                <div className="attach-caption">
                  사진을 함께 남겨요.
                  <button type="button" onClick={() => setPhotoData('')}>
                    지우기
                  </button>
                </div>
              </div>
            )}

            {hasHand && (
              <div className="attach-preview show">
                <img className="handwrite-preview-img" src={handData} alt="손으로 남긴 흔적" />
                <div className="attach-caption">
                  손으로 남긴 흔적을 함께 남겨요.
                  <button type="button" onClick={() => setHandData('')}>
                    지우기
                  </button>
                </div>
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
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden-file-input" onChange={handlePhotoChange} />
          <div className="tool-row">
            <button type="button" className={`tool-pill ${hasPhoto ? 'active' : ''}`} onClick={choosePhoto}>
              <span className="symbol">▧</span>
              <span className="label">{hasPhoto ? '사진 변경' : '사진'}</span>
            </button>
            <button type="button" className={`tool-pill ${hasHand ? 'active' : ''}`} onClick={() => setHandOpen(true)}>
              <span className="symbol">〰</span>
              <span className="label">{hasHand ? '손그림 수정' : '손으로'}</span>
            </button>
          </div>
          <div className="dock-note">글 없이도 괜찮아요. 사진 한 장도, 손글씨 한 줄도 툭이에요.</div>
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
        initialData={handData}
        onClose={() => setHandOpen(false)}
        onAttach={(dataUrl) => {
          setHandData(dataUrl)
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

function HandSheet({ isOpen, initialData, onClose, onAttach }) {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const historyRef = useRef([])
  const drawingRef = useRef(false)
  const [brush, setBrush] = useState('#111')
  const [isEraser, setIsEraser] = useState(false)
  const [hasInk, setHasInk] = useState(Boolean(initialData))
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
    historyRef.current = []
    setHasInk(Boolean(initialData))

    if (initialData) {
      const image = new Image()
      image.onload = () => {
        context.clearRect(0, 0, rect.width, rect.height)
        context.drawImage(image, 0, 0, rect.width, rect.height)
      }
      image.src = initialData
    } else {
      context.clearRect(0, 0, rect.width, rect.height)
    }
  }, [isOpen, initialData])

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
    historyRef.current = [...historyRef.current.slice(-12), canvas.toDataURL('image/png')]
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
    setHasInk(true)
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
      setHasInk(true)
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
    setHasInk(false)
  }

  function pickColor(color) {
    setBrush(color)
    setIsEraser(false)
  }

  function attachDrawing() {
    const canvas = canvasRef.current
    if (!canvas || !hasInk) return
    onAttach(canvas.toDataURL('image/png'))
  }

  return (
    <section className={`hand-modal ${isOpen ? 'show' : ''}`}>
      <div className="hand-panel">
        <div className="hand-top">
          <button type="button" className="x" onClick={onClose}>
            ×
          </button>
          <div className="title">손으로 남기기</div>
          <button type="button" className="attach" onClick={attachDrawing} disabled={!hasInk}>
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

function readPhotoAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.onload = () => resolve(resizeImage(image))
      image.onerror = reject
      image.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function resizeImage(image) {
  const scale = Math.min(1, PHOTO_MAX_SIZE / Math.max(image.width, image.height))
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', 0.82)
}
