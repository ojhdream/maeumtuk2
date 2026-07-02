import Brand from '../../components/Brand'

export default function NowTab({ stage, count }) {
  const locked = stage === 'zero' || stage === 'early'

  return (
    <section className="view active now-view now-editorial">
      <Brand action="☷" />

      <header className="now-editorial-hero">
        <h1 className="hero big">요즘</h1>
        <p className="subcopy now-copy">남긴 툭을 모아 살펴봐요.</p>
      </header>

      {locked ? (
        <LockedNow count={count} />
      ) : (
        <>
          <section className="now-discovery panel">
            <span className="now-eyebrow">오늘의 한 문장</span>
            <h2>
              걱정하면서도
              <br />
              계속 앞으로 가고 있었어요.
            </h2>
            <p>
              최근 남긴 툭을 이어보니 <b>출시</b>, <b>하윤</b>, <b>괜찮아</b>가 자주 함께 머물렀어요.
            </p>
          </section>

          <section className="now-section">
            <SectionHead title="요즘의 나" desc="자주 머문 말과 시간의 흐름" />
            <div className="word-river" aria-label="자주 머문 말">
              <WordChip word="출시" count="5" tone="yellow" />
              <WordChip word="하윤" count="6" tone="green" />
              <WordChip word="괜찮아" count="4" tone="blue" />
              <WordChip word="미술학원" count="3" tone="green" />
            </div>
            <p className="now-soft-line">
              요즘은 무언가를 잘 해내고 싶은 마음과, 가까운 사람을 향한 응원이 함께 남아 있었어요.
            </p>
            <div className="month-calendar">
              <div className="month-calendar-top">
                <strong>5월 마음 캘린더</strong>
                <span>패턴의 시간 보기</span>
              </div>
              <div className="month-grid" aria-label="5월 마음 캘린더">
                {Array.from({ length: 31 }, (_, index) => {
                  const day = index + 1
                  const level = [3, 5, 12, 20, 21, 26, 27].includes(day)
                    ? 'high'
                    : [7, 11, 15, 23, 29].includes(day)
                      ? 'mid'
                      : [2, 18].includes(day)
                        ? 'low'
                        : ''
                  return <span className={level} key={day}>{day}</span>
                })}
              </div>
            </div>
          </section>

          <Divider />

          <section className="now-section">
            <SectionHead title="순간 모음" desc="사진, 손글씨, 글로 남겨둔 장면" />
            <div className="moment-strip">
              <MomentCard type="photo" title="메가커피" meta="사진 · 혼자만의 시간" />
              <MomentCard type="hand" title="fighting!!" meta="손으로 · 첫시작" />
              <MomentCard type="text" title="하윤아. 엄마가 응원해!!!!!" meta="글 · 손으로" />
            </div>
          </section>

          <Divider />

          <section className="now-section">
            <SectionHead title="이어툭" desc="시간이 이어준 이야기" />
            <div className="story-line">
              <div className="story-item">
                <span>5월 20일</span>
                <strong>결정이 어려운 순간</strong>
                <p>여행을 가도 될지 계속 망설였어요.</p>
              </div>
              <div className="story-arrow" aria-hidden="true">↓</div>
              <div className="story-item">
                <span>3일 뒤</span>
                <strong>조금 방향이 보인 날</strong>
                <p>걱정은 남아 있었지만, 마음이 조금 가벼워졌어요.</p>
              </div>
            </div>
          </section>
        </>
      )}
    </section>
  )
}

function LockedNow({ count }) {
  const safeCount = Math.min(10, Math.max(0, count))
  const left = Math.max(0, 10 - safeCount)

  return (
    <section className="now-locked-compact panel">
      <span className="now-eyebrow">첫 요즘까지</span>
      <h2>{safeCount}/10</h2>
      <div className="locked-dots" aria-label={`10개 중 ${safeCount}개`}>
        {Array.from({ length: 10 }, (_, index) => (
          <span className={index < safeCount ? 'filled' : ''} key={index}></span>
        ))}
      </div>
      <p>
        {left > 0
          ? `${left}개의 툭이 더 모이면 당신을 설명하는 첫 문장이 만들어져요.`
          : '첫 번째 요즘이 열렸어요.'}
      </p>
    </section>
  )
}

function SectionHead({ title, desc }) {
  return (
    <div className="now-section-head">
      <h2>{title}</h2>
      <p>{desc}</p>
    </div>
  )
}

function WordChip({ word, count, tone }) {
  return (
    <button type="button" className={`word-chip word-chip--${tone}`}>
      <span>{word}</span>
      <b>{count}</b>
    </button>
  )
}

function MomentCard({ type, title, meta }) {
  return (
    <button type="button" className={`moment-card moment-card--${type}`}>
      <span className="moment-visual" aria-hidden="true">
        {type === 'photo' ? '☕️' : type === 'hand' ? '✍️' : '📝'}
      </span>
      <strong>{title}</strong>
      <small>{meta}</small>
    </button>
  )
}

function Divider() {
  return <div className="now-divider" aria-hidden="true"></div>
}
