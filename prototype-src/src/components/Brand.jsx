export default function Brand({ action, onAction }) {
  return (
    <div className="topbar">
      <div className="brand">
        마음<span className="brand-tuk">툭</span>
        <span className="mark refined-mark" aria-hidden="true">
          <i className="line"></i>
          <i className="dot"></i>
        </span>
      </div>

      <button type="button" className="icon-btn" onClick={onAction}>
        {action}
      </button>
    </div>
  )
}
