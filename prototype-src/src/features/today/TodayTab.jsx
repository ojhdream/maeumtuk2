import Brand from '../../components/Brand'

export default function TodayTab({ stage, count, entries, onOpenEntry, onCycle, onGoTab }) {
  const hasEntries = stage !== 'zero'
  const recentEntries = entries.slice(0, 3)

  return (
    <section className="view active today-screen today-alive">
      <Brand action="↻" onAction={onCycle} />

      <header className="today-hero alive-hero">
        <div className="date">5월 20일 화요일</div>
        <h1 className="hero today-hero-title alive-title">
          지금,
          <br />
          무엇이 <span className="accent">툭</span> 떠올랐나요?
        </h1>
        <p className="guide-copy today-guide alive-guide">
          문득 든 생각,
          <br />
          한 단어여도 괜찮아요.
        </p>

        <div className="today-maeumi-stage" aria-hidden="true">
          <img className="maeumi-base-img" src="./maeumi-base.svg" alt="" />
          <span className="maeumi-dot-css"></span>
        </div>
      </header>

      <button type="button" className="write-hero panel today-write-card alive-write-card" onClick={onOpenEntry}>
        <span className="alive-write-mark" aria-hidden="true">
          <i></i>
          <b></b>
        </span>
        <span className="today-write-copy">
          <strong>{hasEntries ? '툭 남기기' : '첫 툭 남기기'}</strong>
          <span>지금 떠오른 마음을 한 조각 남겨요.</span>
        </span>
      </button>

      {hasEntries ? (
        <>
          <MiniProgress count={count} onGoTab={onGoTab} />
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
    <>
      <section className="today-empty-note panel">
        <strong>아직 첫 툭이 없어요.</strong>
        <p>
          한 단어여도 괜찮아요.
          <br />
          떠오르면 툭 남겨보세요.
        </p>
      </section>
      <MiniProgress count={count} onGoTab={onGoTab} />
    </>
  )
}

function MiniProgress({ count, onGoTab }) {
  const safeCount = Math.min(10, Math.max(0, count))
  const percent = (safeCount / 10) * 100
  const isReady = safeCount >= 10

  return (
    <section className="today-mini-progress alive-discovery-card" onClick={() => onGoTab('now')}>
      <div className="alive-discovery-mark" aria-hidden="true">
        <i></i>
        <b></b>
      </div>

      <h2>
        기록은 내가 하고,
        <br />
        발견은 마음툭이 해요.
      </h2>

      <p>
        {isReady
          ? '요즘 탭에서 지금의 나를 만나볼 수 있어요.'
          : `${safeCount}개의 툭이 모였어요. 조금씩 요즘의 내가 보이기 시작해요.`}
      </p>

      <div className="mini-progress-line" aria-label={`10개 중 ${safeCount}개`}>
        <span className="mini-progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </section>
  )
}

function TodayList({ entries, onGoTab }) {
  if (!entries.length) return null

  return (
    <>
      <div className="section-head today-section-head alive-section-head">
        <div>
          <h2>오늘 남긴 툭</h2>
          <p>오늘의 조각들</p>
        </div>
        <button type="button" onClick={() => onGoTab('log')}>
          모두보기 ›
        </button>
      </div>

      <div className="today-list compact alive-today-list">
        {entries.map((entry) => (
          <article className="today-row" key={entry.id}>
            <div className="today-meta top">
              <span className="type">
                <span className={`dot ${entry.photo ? 'y' : entry.hand ? 'g' : 'b'}`}></span>
                {entry.type}
              </span>
              <span>{entry.time}</span>
            </div>
            {entry.name && <div className="today-title">{entry.name}</div>}
            <p>{entry.text}</p>
          </article>
        ))}
      </div>
    </>
  )
}
