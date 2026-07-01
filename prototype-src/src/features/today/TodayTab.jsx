import Brand from '../../components/Brand'

export default function TodayTab({ stage, count, entries, onOpenEntry, onCycle, onGoTab }) {
  const hasEntries = stage !== 'zero'
  const recentEntries = entries.slice(0, 3)

  return (
    <section className="view active today-screen">
      <Brand action="↻" onAction={onCycle} />

      <header className="today-hero">
        <div className="date">5월 20일 화요일</div>
        <h1 className="hero today-hero-title">
          <span className="accent">툭</span>,
          <br />
          떠오른 게 있나요?
        </h1>
        <p className="guide-copy today-guide">한 단어여도 괜찮아요.</p>
      </header>

      <button type="button" className="write-hero panel today-write-card" onClick={onOpenEntry}>
        <span className="today-write-visual" aria-hidden="true">
          <img className="maeumi-base-img" src="./maeumi-base.svg" alt="" />
          <span className="maeumi-dot-css"></span>
        </span>
        <span className="today-write-copy">
          <strong>{hasEntries ? '툭 남기기' : '첫 툭 남기기'}</strong>
          <span>지금 떠오른 마음을 여기에 잠깐 두고 가세요.</span>
        </span>
      </button>

      {hasEntries ? (
        <>
          <TodayInsight stage={stage} onGoTab={onGoTab} />
          <TodayList entries={recentEntries} onGoTab={onGoTab} />
        </>
      ) : (
        <ZeroState count={count} onGoTab={onGoTab} />
      )}
    </section>
  )
}

function ZeroState({ count, onGoTab }) {
  return (
    <section className="today-zero">
      <p>
        처음엔 짧게 시작해도 좋아요.
        <br />
        툭이 쌓이면 요즘의 마음이 조금씩 보여요.
      </p>
      <MiniProgress count={count} onGoTab={onGoTab} />
    </section>
  )
}

function TodayInsight({ stage, onGoTab }) {
  const copy =
    stage === 'early'
      ? ['조금씩 모이는 중', '첫 툭이 남았어요. 더 모이면 비슷한 마음이 보이기 시작해요.', '요즘 미리보기']
      : stage === 'growing'
        ? ['오늘의 발견', '요즘 “괜찮아”와 “하고 싶음”이 자주 머물고 있어요.', '요즘 보기']
        : ['오늘의 발견', '요즘의 마음이 조금 보이기 시작했어요.', '첫 리포트 보기']

  return (
    <section className="today-insight panel" onClick={() => onGoTab('now')}>
      <div className="state-label">{copy[0]}</div>
      <p>{copy[1]}</p>
      <button type="button">{copy[2]} ›</button>
    </section>
  )
}

function MiniProgress({ count, onGoTab }) {
  const safeCount = Math.min(10, count)

  return (
    <section className="today-mini-progress" onClick={() => onGoTab('now')}>
      <span className="mini-progress-dot"></span>
      <span>{safeCount}/10</span>
      <p>10툭이 모이면 첫 발견이 열려요.</p>
    </section>
  )
}

function TodayList({ entries, onGoTab }) {
  if (!entries.length) return null

  return (
    <>
      <div className="section-head today-section-head">
        <h2>오늘 남긴 툭</h2>
        <button type="button" onClick={() => onGoTab('log')}>
          모두보기 ›
        </button>
      </div>

      <div className="today-list compact">
        {entries.map((entry) => (
          <article className="today-row" key={entry.id}>
            {entry.name && <div className="today-title">{entry.name}</div>}
            <p>{entry.text}</p>
            <div className="today-meta">
              <span className="type">
                <span className={`dot ${entry.photo ? 'y' : entry.hand ? 'g' : 'b'}`}></span>
                {entry.type}
              </span>
              <span>{entry.time}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
