export default function TukRitual({ show }) {
  return (
    <section className={`tuk-ritual ${show ? 'show' : ''}`} aria-hidden="true">
      <div className="tuk-ritual-inner">
        <div className="tuk-ritual-symbol">
          <img className="tuk-ritual-maeumi" src="./maeumi-base.svg" alt="" />
          <span className="tuk-ritual-dot"></span>
        </div>
        <div className="tuk-ritual-word">툭.</div>
        <div className="tuk-ritual-copy">마음이 남겨졌어요.</div>
      </div>
    </section>
  )
}
