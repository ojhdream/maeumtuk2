import Brand from '../../components/Brand'

export default function TodayTab({ stage, count, entries, onOpenEntry, onCycle, onGoTab }) {
  const hasEntries = stage !== 'zero'
  const recentEntries = entries.slice(0, 3)

  return (
    <section className="view active today-screen today-final">
      <Brand action="↻" onAction={onCycle} />

      <header className="today-final-hero">
        <div className="date">5월 20일 화요일</div>

        <h1 className="today-final-title">
          오늘은
          <br />
          무엇이 <span className="accent">남았나요?</span>
        </h1>

        <p className="today-final-guide">
          문득 스친 생각,
          <br />
          사진 한 장,
          <br />
          한 단어도 괜찮아요.
        </p>

        <div className="today-final-maeumi" aria-hidden="true">
          <img src="./maeumi-base.svg" alt="" />
          <span></span>
        </div>
      </header>

      <button type="button" className="today-final-write" onClick={onOpenEntry}>
        <span className="today-final-write-mark" aria-hidden="true">
          <i></i>
          <b></b>
        </span>

        <span className="today-final-write-copy">
          <strong>{hasEntries ? '툭 남기기' : '첫 툭 남기기'}</strong>
          <small>지금 떠오른 마음을 한 조각 남겨보세요.</small>
        </span>

        <span className="today-final-arrow" aria-hidden="true">›</span>
      </button>

      {hasEntries ? (
        <>
          <TodayList entries={recentEntries} onGoTab={onGoTab} />
          <DiscoveryCard count={count} onGoTab={onGoTab} />
        </>
      ) : (
        <>
          <section className="today-final-empty">
            <strong>아직 첫 툭이 없어요.</strong>
            <p>떠오르면 가볍게 남겨보세요.</p>
          </section>
          <DiscoveryCard count={count} onGoTab={onGoTab} />
        </>
      )}
    </section>
  )
}

function DiscoveryCard({ count, onGoTab }) {
  const safeCount = Math.min(10, Math.max(0, count))
  const percent = (safeCount / 10) * 100
  const isReady = safeCount >= 10
  const note =
    safeCount === 0
      ? '툭이 모이면 발견이 시작돼요.'
      : isReady
        ? '요즘의 당신 리포트가 열렸어요.'
        : `${10 - safeCount}개만 더 남기면 첫 리포트를 보여드릴게요.`

  return (
    <section className="progress-card panel today-final-progress-card">
      <div className="progress-top">
        <div>
          <strong>
            10개의 툭이 모이면
            <br />
            요즘의 내가 보여요.
          </strong>
          <span>{safeCount === 0 ? '첫 조각부터 시작해요.' : `지금은 ${safeCount}개의 조각이 모였어요.`}</span>
        </div>
        <div className="progress-count">{safeCount}/10</div>
      </div>

      <div className="progress-track" aria-label={`10개 중 ${safeCount}개`}>
        <i style={{ '--w': `${percent}%` }}></i>
      </div>

      <div className="progress-note">
        <span>{note}</span>
        <button type="button" onClick={() => onGoTab('now')}>
          요즘 보기
        </button>
      </div>
    </section>
  )
}

function TodayList({ entries, onGoTab }) {
  if (!entries.length) return null

  return (
    <>
      <div className="today-final-section-head">
        <h2>오늘 남긴 툭</h2>
        <button type="button" onClick={() => onGoTab('log')}>모두보기 ›</button>
      </div>

      <div className="today-final-list">
        {entries.map((entry) => (
          <article className="today-final-row" key={entry.id}>
            <div>
              {entry.name && <strong>{entry.name}</strong>}
              <p>{entry.text}</p>
            </div>
            <span>{entry.time}</span>
          </article>
        ))}
      </div>
    </>
  )
}
