import type { Question } from '../data'
import type { Person } from '../types'

type Props = {
  qOpacity: number
  qLabel: string
  question: Question
  family: Person[]
  onTogglePerson: (index: number, key: 'vigsel' | 'brollop', value: boolean | null) => void
  hasSeats: boolean | null
  onToggleCar: (value: boolean | null) => void
  onBack: () => void
  onNext: () => void
  errorText: string
}

const questionImage: Record<string, { src: string; alt: string }> = {
  church: { src: '/brollop/nasinge-kyrka.png', alt: 'Näsinge kyrka' },
  tour: { src: '/brollop/fastningen-gata.png', alt: 'Gata på Fredriksten fästning' },
  photo: { src: '/brollop/080623_pilgrimsleden_1774_www-vikenfotov-mrrip46n-014v.jpg', alt: 'Fredrikstens fästning' },
}

export default function QuestionStep({ qOpacity, qLabel, question: q, family, onTogglePerson, hasSeats, onToggleCar, onBack, onNext, errorText }: Props) {
  const image = q.image ? questionImage[q.image] : null
  const personKey = q.key as 'vigsel' | 'brollop'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, transition: 'opacity .28s ease', opacity: qOpacity }}>
      <div className="brollop-eyebrow" style={{ textAlign: 'center' }}>{qLabel}</div>
      <div className="brollop-script" style={{ fontSize: 30, lineHeight: 1.45 }}>{q.title}</div>
      <div style={{ fontSize: 14.5, lineHeight: 1.7, opacity: 0.9 }}>{q.meta}</div>

      {image && (
        <div className="brollop-photo-frame" style={{ aspectRatio: '4/3' }}>
          <img src={image.src} alt={image.alt} style={{ aspectRatio: '4/3' }} />
        </div>
      )}

      {q.type === 'car' ? (
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1.5px solid var(--ink)', borderBottom: '1.5px solid var(--ink)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '14px 0', fontSize: 15.5 }}>
            Vi kommer med bil
            <div className="brollop-toggle-choice">
              <label><span>JA</span><input type="checkbox" checked={hasSeats === true} onChange={(e) => onToggleCar(e.target.checked ? true : null)} /></label>
              <label><span>NEJ</span><input type="checkbox" checked={hasSeats === false} onChange={(e) => onToggleCar(e.target.checked ? false : null)} /></label>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {family.map((p, i) => (
            <div className="brollop-toggle-row" key={p.namn}>
              {p.namn}
              <div className="brollop-toggle-choice">
                <label><span>JA</span><input type="checkbox" checked={p[personKey] === true} onChange={(e) => onTogglePerson(i, personKey, e.target.checked ? true : null)} /></label>
                <label><span>NEJ</span><input type="checkbox" checked={p[personKey] === false} onChange={(e) => onTogglePerson(i, personKey, e.target.checked ? false : null)} /></label>
              </div>
            </div>
          ))}
          <div style={{ borderTop: '1.5px solid var(--ink)' }} />
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}>
        <button onClick={onBack} className="brollop-btn-secondary">TILLBAKA</button>
        <button onClick={onNext} className="brollop-btn-primary" style={{ flex: 1 }}>NÄSTA</button>
      </div>
      {errorText && <div style={{ fontSize: 12.5, lineHeight: 1.6, textAlign: 'center' }}>{errorText}</div>}
    </div>
  )
}
