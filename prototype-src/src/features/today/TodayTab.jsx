import Brand from '../../components/Brand'

export default function TodayTab({ stage, count, entries, onOpenEntry, onCycle, onGoTab }) {
  return (
    <section className="view active">
      <Brand action="↻" onAction={onCycle} />
      <div className="date">5월 20일 화요일</div>
      <h1 className="hero">
        지금,
        <br />
        무엇이 <span className="accent">툭</span> 떠올랐나요?
      </h1>
      <p className="guide-copy">
        문득 든 생각,
        <br />
        한 단어여도 괜찮아요.
      </p>
      <div className="maeumi-stage" aria-hidden="true">
        <img className="maeumi-base-img" src="./maeumi-base.svg" alt="" />
        <span className="maeumi-dot-css"></span>
      </div>
      <button type="button" className="write-hero panel" onClick={onOpenEntry}>
        <span className="write-hero-main">
          <span className="write-ico">
            <span className="save-mark"></span>
          </span>
          <span>
            <strong>툭 남기기</strong>
            <span>지금 떠오른 마음을 한 조각 남겨요.</span>
          </span>
        </span>
      </button>
      <TodayState stage={stage} count={count} onOpenEntry={onOpenEntry} onGoTab={onGoTab} />
      {stage !== 'zero' && <TodayList entries={entries} onGoTab={onGoTab} />}
    </section>
  )
}

function TodayState({ stage, count, onOpenEntry, onGoTab }) {
  if (stage === 'zero') {
    return (
      <>
        <section className="empty-tuk panel">
          <strong>아직 첫 툭이 없어요</strong>
          <p>한 줄이어도 괜찮아요. 지금 떠오른 것을 먼저 남겨보세요.</p>
          <button type="button" onClick={onOpenEntry}>
            첫 툭 남기기
          </button>
        </section>
        <ProgressCard count={0} note="툭이 모이면 발견이 시작돼요." onGoTab={onGoTab} />
      </>
    )
  }

  const copy =
    stage === 'early'
      ? ['조금씩 모이는 중', '첫 번째 툭이 남았어요. 하나의 조각도 나중의 요즘을 보여주는 단서가 됩니다.', '요즘 미리보기']
      : stage === 'growing'
        ? ['오늘의 발견', '요즘은 “괜찮아”와 “하고 싶음”이 자주 머물고 있어요.', '요즘에서 더 보기']
        : ['오늘의 발견', '요즘이 조금 보이기 시작했어요. 자주 머문 것과 오래 남은 마음을 확인해보세요.', '첫 리포트 보기']

  return (
    <>
      <section className="state-card panel" onClick={() => onGoTab('now')}>
        <div className="state-label">{copy[0]}</div>
        <p>{copy[1]}</p>
        <div className="go">{copy[2]} ›</div>
      </section>
      <ProgressCard
        count={Math.min(10, count)}
        note={stage === 'ready' ? '요즘 리포트가 열렸어요.' : `${10 - count}개만 더 남기면 첫 리포트를 보여드릴게요.`}
        onGoTab={onGoTab}
      />
    </>
  )
}

function ProgressCard({ count, note, onGoTab }) {
  return (
    <section className="progress-card panel">
      <div className="progress-top">
        <div>
          <strong>
            10개의 툭이 모이면
            <br />
            요즘의 내가 보여요
          </strong>
          <span>지금까지 {count}개의 조각을 모았어요.</span>
        </div>
        <div className="progress-count">{count}/10</div>
      </div>
      <div className="progress-track">
        <i style={{ '--w': `${count * 10}%` }}></i>
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
  return (
    <>
      <div className="section-head">
        <h2>오늘 남긴 툭</h2>
        <button type="button" onClick={() => onGoTab('log')}>
          모두보기 ›
        </button>
      </div>
      <div className="today-list">
        {entries.slice(0, 3).map((entry) => (
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
      <div className="today-ways">
        <div className="today-ways-head">
          <b>오늘 남긴 것</b>
          <span>자동 표시</span>
        </div>
        <div className="way-row">
          <div className="way-pill">
            <span className="dot b"></span>글 <b>3</b>
          </div>
          <div className="way-pill">
            <span className="dot g"></span>손으로 <b>1</b>
          </div>
          <div className="way-pill">
            <span className="dot y"></span>사진 <b>1</b>
          </div>
        </div>
      </div>
    </>
  )
}
