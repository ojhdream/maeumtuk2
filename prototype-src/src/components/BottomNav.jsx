import { tabs } from '../constants/tabs'

export default function BottomNav({ current, onChange }) {
  return (
    <nav className="bottom-nav" aria-label="하단 탭">
      {tabs.map((item) => (
        <button type="button" className={`nav-item ${current === item.id ? 'active' : ''}`} key={item.id} onClick={() => onChange(item.id)}>
          <span className="ico">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
