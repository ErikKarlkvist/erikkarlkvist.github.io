import TripInfo from './TripInfo'

type Props = {
  greetIn: boolean
  greetLine: string
  askLine: string
  hasPrevious: boolean
  onYes: () => void
  onNo: () => void
  onBackToName: () => void
}

export default function GreetStep({ greetIn, greetLine, askLine, hasPrevious, onYes, onNo, onBackToName }: Props) {
  return (
    <div
      style={{
        width: '100%',
        paddingTop: 'calc(var(--w) * 0.14)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 26,
        textAlign: 'center',
        transition: 'opacity .6s ease, transform .6s ease',
        opacity: greetIn ? 1 : 0,
        transform: `translateY(${greetIn ? '0px' : '12px'})`,
      }}
    >
      <div className="brollop-script" style={{ fontSize: 34, lineHeight: 1.45 }}>{greetLine}</div>
      {hasPrevious && (
        <div style={{ border: '1.5px solid var(--ink)', borderRadius: 16, padding: '14px 18px', fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>
          Ni har redan svarat en gång — skickar ni igen skriver vi över det svaret.
        </div>
      )}

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'left' }}>
        <TripInfo />
      </div>

      <div style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.92 }}>{askLine}</div>
      <div style={{ display: 'flex', gap: 14, width: '100%', marginTop: 4 }}>
        <button onClick={onYes} className="brollop-btn-primary" style={{ flex: 1 }}>JA</button>
        <button onClick={onNo} className="brollop-btn-secondary" style={{ flex: 1 }}>NEJ</button>
      </div>
      <button onClick={onBackToName} className="brollop-btn-link">Inte du? Byt namn</button>
    </div>
  )
}
