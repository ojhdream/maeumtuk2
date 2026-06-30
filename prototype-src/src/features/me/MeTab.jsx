import Brand from '../../components/Brand'

export default function MeTab() {
  return (
    <section className="view active">
      <Brand action="☷" />
      <h1 className="hero big">나</h1>
      <p className="subcopy now-copy">계정과 백업을 관리해요.</p>
      <div className="profile-card panel">
        <div className="avatar">
          <span className="mark">
            <i className="line"></i>
            <i className="dot"></i>
          </span>
        </div>
        <div>
          <h2>마음툭 사용자</h2>
          <p>32일째 마음을 남기는 중이에요.</p>
        </div>
      </div>
      <div className="stats">
        <div className="stat"><b>84</b><span>전체 툭</span></div>
        <div className="stat"><b>5</b><span>이어툭</span></div>
        <div className="stat"><b>21</b><span>마음 이름</span></div>
      </div>
      <SettingsGroup title="툭">
        <Setting label="마음 이름 모아보기" value="21개 ›" />
        <Setting label="이어툭 모아보기" value="5개 ›" />
        <Setting label="남겨둔 마음" value="3개 ›" />
      </SettingsGroup>
      <SettingsGroup title="백업 및 동기화">
        <div className="setting-row panel multi">
          <div className="sync-state">자동 백업 켜짐</div>
          <p>마지막 동기화 방금 전 · 사진과 손으로 포함</p>
        </div>
        <Setting label="클라우드 연결" value="Google Drive ›" />
        <Setting label="기기 저장 공간" value="관리 ›" />
        <Setting label="데이터 내보내기" value="PDF / 텍스트 ›" />
      </SettingsGroup>
      <SettingsGroup title="앱 설정">
        <Setting label="알림 시간" value="오후 9:00 ›" />
        <Setting label="잠금 설정" value="꺼짐 ›" />
        <Setting label="앱 정보" value="v1.0 ›" />
      </SettingsGroup>
    </section>
  )
}

function SettingsGroup({ title, children }) {
  return (
    <>
      <div className="setting-group-title">{title}</div>
      {children}
    </>
  )
}

function Setting({ label, value }) {
  return (
    <div className="setting-row panel">
      {label}
      <span>{value}</span>
    </div>
  )
}
