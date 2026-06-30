import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { initialEntries } from './data/initialEntries'
import TodayTab from './features/today/TodayTab'
import LogTab from './features/log/LogTab'
import NowTab from './features/now/NowTab'
import MeTab from './features/me/MeTab'
import EntryOverlay from './features/entry/EntryOverlay'
import BottomNav from './components/BottomNav'
import TukRitual from './components/TukRitual'

const STORAGE_KEY = 'maeumtuk2.qaState.v1'

const defaultQaState = {
  entries: initialEntries,
  tukCount: 8,
  tab: 'today',
  expandedThreads: [1],
}

function loadQaState() {
  if (typeof window === 'undefined') return defaultQaState

  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY)
    if (!rawState) return defaultQaState

    const parsedState = JSON.parse(rawState)
    return {
      entries: Array.isArray(parsedState.entries) ? parsedState.entries : defaultQaState.entries,
      tukCount: Number.isFinite(parsedState.tukCount) ? parsedState.tukCount : defaultQaState.tukCount,
      tab: typeof parsedState.tab === 'string' ? parsedState.tab : defaultQaState.tab,
      expandedThreads: Array.isArray(parsedState.expandedThreads)
        ? parsedState.expandedThreads
        : defaultQaState.expandedThreads,
    }
  } catch {
    return defaultQaState
  }
}

function App() {
  const [qaState] = useState(loadQaState)
  const [tab, setTab] = useState(qaState.tab)
  const [entries, setEntries] = useState(qaState.entries)
  const [tukCount, setTukCount] = useState(qaState.tukCount)
  const [isEntryOpen, setIsEntryOpen] = useState(false)
  const [isFabOpen, setIsFabOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [expandedThreads, setExpandedThreads] = useState(qaState.expandedThreads)
  const [inlineOpen, setInlineOpen] = useState(null)
  const [toast, setToast] = useState('')
  const [showRitual, setShowRitual] = useState(false)

  const stage = tukCount === 0 ? 'zero' : tukCount < 4 ? 'early' : tukCount < 10 ? 'growing' : 'ready'
  const todayEntries = entries.filter((entry) => entry.date === '5월 20일 화요일')

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          entries,
          tukCount,
          tab,
          expandedThreads,
        }),
      )
    } catch {
      // QA persistence should never block the prototype UI.
    }
  }, [entries, tukCount, tab, expandedThreads])

  const filteredEntries = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return entries
    return entries.filter((entry) =>
      [entry.date, entry.time, entry.type, entry.name, entry.text, ...entry.follows.map((follow) => follow.text)]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [entries, search])

  function showToast(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 1600)
  }

  function cycleState() {
    const states = [0, 2, 8, 10]
    const next = states[(states.indexOf(tukCount) + 1) % states.length]
    setTukCount(next)
    showToast(`${next}툭 상태 보기`)
  }

  function goTab(nextTab) {
    setTab(nextTab)
    setIsFabOpen(false)
  }

  function saveEntry({ text, name, hasPhoto, hasHand }) {
    const isFirstTuk = tukCount === 0
    const nextEntry = {
      id: Date.now(),
      date: '5월 20일 화요일',
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
      type: hasPhoto && hasHand ? '글 · 사진 · 손으로' : hasPhoto ? '글 · 사진' : hasHand ? '글 · 손으로' : '글',
      tone: hasPhoto ? 'mix' : hasHand ? 'hand' : 'text',
      name,
      text: text || '짧은 마음 하나를 툭 남겼어요.',
      photo: hasPhoto,
      hand: hasHand,
      follows: [],
    }
    setEntries((current) => [nextEntry, ...current])
    setTukCount((current) => Math.min(10, Math.max(1, current + 1)))
    setIsEntryOpen(false)
    setShowRitual(false)
    window.setTimeout(() => setShowRitual(true), 0)
    window.setTimeout(() => setShowRitual(false), 1300)
    window.setTimeout(() => showToast(isFirstTuk ? '첫 번째 툭이 남았어요' : '툭 남겼어요'), 920)
  }

  function toggleThread(id) {
    setExpandedThreads((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]))
  }

  function openInlineComposer(id) {
    setExpandedThreads((current) => (current.includes(id) ? current : [...current, id]))
    setInlineOpen(id)
  }

  function saveInline(id, text) {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              follows: [
                ...entry.follows,
                {
                  id: `${id}-${Date.now()}`,
                  time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
                  text: text || '시간이 지나 다시 떠오른 마음을 덧붙였어요.',
                },
              ],
            }
          : entry,
      ),
    )
    setInlineOpen(null)
    showToast('이어 툭을 남겼어요')
  }

  return (
    <section className="phone" aria-label="마음툭 React 모바일 프로토타입">
      <div className="app">
        <main className="screen">
          {tab === 'today' && (
            <TodayTab
              stage={stage}
              count={tukCount}
              entries={todayEntries}
              onOpenEntry={() => setIsEntryOpen(true)}
              onCycle={cycleState}
              onGoTab={goTab}
            />
          )}
          {tab === 'log' && (
            <LogTab
              entries={filteredEntries}
              isSearchOpen={isSearchOpen}
              search={search}
              expandedThreads={expandedThreads}
              inlineOpen={inlineOpen}
              onSearchOpen={() => setIsSearchOpen(true)}
              onSearchClose={() => {
                setSearch('')
                setIsSearchOpen(false)
              }}
              onSearch={setSearch}
              onQuickSearch={(value) => {
                setIsSearchOpen(true)
                setSearch(value)
              }}
              onToggleThread={toggleThread}
              onOpenInline={openInlineComposer}
              onSaveInline={saveInline}
              onToast={showToast}
            />
          )}
          {tab === 'now' && <NowTab stage={stage} count={tukCount} />}
          {tab === 'me' && <MeTab />}
        </main>

        <BottomNav current={tab} onChange={goTab} />

        {(tab === 'log' || tab === 'now') && (
          <>
            <div className={`fab-menu ${isFabOpen ? 'show' : ''}`}>
              <button type="button" onClick={() => setIsEntryOpen(true)}>
                새 툭 남기기
              </button>
              <button type="button" onClick={() => goTab('log')}>
                최근 툭 이어쓰기
              </button>
              <button type="button" onClick={() => openInlineComposer(entries[0]?.id)}>
                이어툭 남기기
              </button>
            </div>
            <button type="button" className="brand-fab show" onClick={() => setIsFabOpen((value) => !value)}>
              <span className="fab-line"></span>
              <span className="fab-dot"></span>
            </button>
          </>
        )}

        <EntryOverlay isOpen={isEntryOpen} onClose={() => setIsEntryOpen(false)} onSave={saveEntry} />
        <TukRitual show={showRitual} />
        <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
      </div>
    </section>
  )
}

export default App
