import Brand from '../../components/Brand'

export default function NowTab({ stage, count }) {
  const locked = stage === 'zero' || stage === 'early'

  return (
    <section className="view active now-view">
      <Brand action="☷" />

      <h1 className="hero big">요즘</h1>
      <p className="subcopy now-copy">
        최근의 당신이
        <br />
        조금씩 보이는 곳.
      </p>

      <section className={`now-hero-card panel now-card--yellow ${locked ? 'is-locked' : ''}`}>
        <ColorLabel tone="yellow">{locked ? '아직 첫 조각 전' : '첫 10툭 리포트'}</ColorLabel>

        <h2>
          {locked ? (
            <>
              툭이 생기면
              <br />
              요즘의 내가 보여요.
            </>
          ) : (
            <>
              이번 주의 당신은
              <br />
              걱정하면서도 계속 만들고 있었어요.
            </>
          )}
        </h2>

        <p>
          {locked
            ? '먼저 오늘탭에서 한 줄을 남겨보세요. 마음툭은 그 조각들을 모아 작은 발견을 보여줄게요.'
            : '판단하지 않고, 내 안에 남은 반복을 조용히 비춰볼게요.'}
        </p>

        <div className="unlock-steps">
          <Step state={count >= 1 ? 'done' : 'active'} label="첫 번째 툭이 남으면 시작돼요." value="1" />
          <Step state={count >= 3 ? 'done' : count > 1 ? 'active' : ''} label="비슷한 마음이 보이기 시작해요." value="3" />
          <Step state={count >= 8 ? 'done' : count > 3 ? 'active' : ''} label="당신을 설명하는 첫 문장이 만들어져요." value="8" />
          <Step state={count >= 10 ? 'active' : ''} label="10툭에서 첫 리포트가 열려요." value="10" />
        </div>
      </section>

      {!locked && (
        <>
          <section className="panel now-card now-card--yellow">
            <div className="card-head">
              <CardTitle tone="yellow">이번 주의 당신</CardTitle>
              <span>첫 리포트</span>
            </div>
            <div className="insight-sentence insight-sentence--warm">
              최근 툭에서는 <b>출시를 향한 걱정</b>과 <b>아이디어에 대한 생각</b>이 함께 머물고 있어요.
            </div>
          </section>

          <section className="panel now-card now-card--green">
            <div className="card-head">
              <CardTitle tone="green">모인 마음</CardTitle>
              <span>들어가서 보는 곳</span>
            </div>
            <div className="gather-grid">
              <GatherCard tone="green" title="하윤" meta="6개의 툭 · 사진 4 · 이어툭 2 · 최근 오늘" count="6" />
              <GatherCard tone="yellow" title="출시" meta="5개의 툭 · 걱정과 기대가 함께 남았어요" count="5" />
              <GatherCard tone="blue" title="미술학원" meta="3개의 툭 · 오후에 자주 남았어요" count="3" />
            </div>
          </section>

          <section className="panel now-card now-card--yellow">
            <div className="card-head">
              <CardTitle tone="yellow">요즘 머문 말</CardTitle>
              <span>이번 주 흐름</span>
            </div>
            <p className="word-summary word-summary--warm">
              이번 주에는 <b>출시</b>라는 말이 가장 자주 머물렀어요. 그 곁에는 <b>하윤</b>과 <b>괜찮아</b>도 함께 있었어요.
            </p>
          </section>

          <section className="panel now-card now-card--yellow">
            <div className="card-head">
              <CardTitle tone="yellow">마음 캘린더</CardTitle>
              <span>단어가 남긴 흔적</span>
            </div>
            <div className="calendar-tags">
              <div className="tag"><span className="dot g"></span>하윤</div>
              <div className="tag"><span className="dot y"></span>출시</div>
              <div className="tag"><span className="dot b"></span>미술학원</div>
            </div>
            <div className="week">
              {[23, 24, 25, 26, 27, 28, 29].map((day) => (
                <div className={`day ${day === 23 ? 'active' : ''}`} key={day}>
                  {day}
                  {[23, 26, 27].includes(day) && (
                    <div className="day-dots">
                      <i className="dot y"></i>
                      <i className="dot b"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="panel now-card now-card--blue">
            <div className="card-head">
              <CardTitle tone="blue">오래 남은 마음</CardTitle>
              <span>이어툭 기준</span>
            </div>
            <LongMind tone="blue" title="좋은 저녁" count="이어툭 2개" text="처음 남긴 뒤 이틀 동안 다시 떠올랐어요." />
            <LongMind tone="blue" title="괜찮아지는 중" count="이어툭 1개" text="퇴근길에 한 번 더 이어진 마음이에요." />
          </section>

          <section className="panel now-card now-card--yellow">
            <div className="card-head">
              <CardTitle tone="yellow">이번 주의 조각</CardTitle>
              <span>다시 보기</span>
            </div>
            <p className="quote quote--warm">“집에 와서 생각해보니 오늘이 생각보다 오래 남는다.”</p>
          </section>
        </>
      )}
    </section>
  )
}

function ColorLabel({ tone = 'yellow', children }) {
  return (
    <div className={`eyebrow color-label color-label--${tone}`}>
      <span className={`dot ${toneToDot(tone)}`}></span>
      {children}
    </div>
  )
}

function CardTitle({ tone = 'yellow', children }) {
  return (
    <strong className="card-title-with-dot">
      <span className={`dot ${toneToDot(tone)}`}></span>
      {children}
    </strong>
  )
}

function Step({ value, label, state }) {
  return (
    <div className={`unlock-step ${state}`}>
      <b>{value}</b>
      <span>{label}</span>
    </div>
  )
}

function GatherCard({ title, meta, count, tone = 'green' }) {
  return (
    <div className={`gather-card gather-card--${tone}`}>
      <div className="gather-main">
        <b>{title}</b>
        <span>{meta}</span>
      </div>
      <div className="gather-badge">{count}</div>
    </div>
  )
}

function LongMind({ title, count, text, tone = 'blue' }) {
  return (
    <div className={`long-mind long-mind--${tone}`}>
      <div className="long-mind-top">
        <b>{title}</b>
        <span>{count}</span>
      </div>
      <p>{text}</p>
    </div>
  )
}

function toneToDot(tone) {
  if (tone === 'green') return 'g'
  if (tone === 'blue') return 'b'
  return 'y'
}
