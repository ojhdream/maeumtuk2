import { useState } from 'react'
import Brand from '../../components/Brand'

export default function LogTab(props) {
  const months = ['2026년 4월', '2026년 5월', '2026년 6월']
  const [monthIndex, setMonthIndex] = useState(1)
  const currentMonth = months[monthIndex]
  const monthNumber = currentMonth.match(/(\d+)월/)?.[1]
  const monthEntries = monthNumber ? props.entries.filter((entry) => entry.date.startsWith(`${monthNumber}월`)) : props.entries
  const grouped = monthEntries.reduce((acc, entry) => {
    acc[entry.date] = acc[entry.date] || []
    acc[entry.date].push(entry)
    return acc
  }, {})
  const canGoPrev = monthIndex > 0
  const canGoNext = monthIndex < months.length - 1

  function moveMonth(direction) {
    setMonthIndex((current) => Math.min(months.length - 1, Math.max(0, current + direction)))
  }

  return (
    <section className="view active">
      <Brand action="☷" />
      <div className="log-head-row">
        <h1 className="log-title">툭로그</h1>
        <button type="button" className="search-icon-btn" onClick={props.onSearchOpen}>
          ⌕
        </button>
      </div>
      <div className="month-nav" aria-label="월 이동">
        <button type="button" className="month-nav-btn" onClick={() => moveMonth(-1)} disabled={!canGoPrev} aria-label="이전 달">
          ‹
        </button>
        <button type="button" className="month-chip" onClick={() => props.onToast(`${currentMonth} 툭로그`)}>
          {currentMonth} <span>▾</span>
        </button>
        <button type="button" className="month-nav-btn" onClick={() => moveMonth(1)} disabled={!canGoNext} aria-label="다음 달">
          ›
        </button>
      </div>
      <p className="log-sub">화면 이동 없이 툭을 펼치고, 그 자리에서 이어 툭을 남겨요.</p>
      <div className={`search-panel ${props.isSearchOpen ? 'open' : ''}`}>
        <div className="search-box">
          ⌕
          <input value={props.search} onChange={(event) => props.onSearch(event.target.value)} placeholder="마음 이름, 단어, 툭 검색" />
          <button type="button" className="search-cancel" onClick={props.onSearchClose}>
            취소
          </button>
        </div>
        <div className="search-chips">
          {['좋은 저녁', '괜찮아지는 중', '하윤'].map((value) => (
            <button type="button" className="search-chip" key={value} onClick={() => props.onQuickSearch(value)}>
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="filter-row">
        {['전체', '글', '손으로', '사진', '이어툭'].map((filter, index) => (
          <button type="button" className={`filter ${index === 0 ? 'active' : ''}`} key={filter}>
            {filter}
          </button>
        ))}
      </div>
      {Object.entries(grouped).length > 0 ? (
        Object.entries(grouped).map(([date, dateEntries]) => (
          <section className="day-group" key={date}>
            <div className="day-header">
              {date} <span>{dateEntries.length}개</span>
            </div>
            {dateEntries.map((entry) => (
              <LogEntry key={entry.id} entry={entry} {...props} />
            ))}
          </section>
        ))
      ) : (
        <section className="log-empty panel">
          <strong>이 달에는 아직 툭이 없어요.</strong>
          <p>월을 이동해 다른 날의 툭을 확인해보세요.</p>
        </section>
      )}
    </section>
  )
}

function LogEntry({ entry, expandedThreads, inlineOpen, onToggleThread, onOpenInline, onSaveInline, onToast }) {
  const [inlineText, setInlineText] = useState('')
  const isExpanded = expandedThreads.includes(entry.id)
  const isInlineOpen = inlineOpen === entry.id

  return (
    <article className="log-entry">
      <div className="entry-meta">
        <div className="entry-left">
          <span>{entry.time}</span>
          <span className={`entry-type ${entry.tone}`}>{entry.type}</span>
        </div>
        <button type="button" className="more-btn" onClick={() => onToast('QA용 메뉴: 수정 · 이어툭 · 남겨둠 · 삭제')}>
          ⋯
        </button>
      </div>
      <p>{entry.text}</p>
      {entry.name && <span className="name-chip">{entry.name}</span>}
      {entry.photo && <div className="photo-chip">사진</div>}
      {entry.hand && <div className="hand-preview"></div>}
      <div className="entry-actions">
        {entry.follows.length > 0 && (
          <button type="button" className="tiny-btn primary" onClick={() => onToggleThread(entry.id)}>
            {isExpanded ? '접기' : `이어툭 ${entry.follows.length}개 보기`}
          </button>
        )}
        <button type="button" className="tiny-btn" onClick={() => onOpenInline(entry.id)}>
          + 이어 툭
        </button>
      </div>
      <div className={`follow-thread ${isExpanded ? 'open' : ''}`}>
        {entry.follows.map((follow) => (
          <div className="follow-item" key={follow.id}>
            <div className="follow-meta">
              <div className="follow-left">
                <span>{follow.time}</span>
                <span>이어 툭</span>
              </div>
              <button type="button" className="more-btn" onClick={() => onToast('QA용 메뉴: 수정 · 삭제')}>
                ⋯
              </button>
            </div>
            <p>{follow.text}</p>
          </div>
        ))}
        <div className={`inline-composer ${isInlineOpen ? 'open' : ''}`}>
          <textarea
            value={inlineText}
            onChange={(event) => setInlineText(event.target.value)}
            placeholder="이 툭에 이어서 떠오른 마음을 남겨보세요."
          ></textarea>
          <div className="inline-tools">
            <span>원본 툭에 조각처럼 붙어요.</span>
            <button
              type="button"
              onClick={() => {
                onSaveInline(entry.id, inlineText.trim())
                setInlineText('')
              }}
            >
              남기기
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
