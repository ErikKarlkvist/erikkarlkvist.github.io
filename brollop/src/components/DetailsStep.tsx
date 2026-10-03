type Attendee = { index: number; namn: string; allergier: string }

type Props = {
  qOpacity: number
  attendees: Attendee[]
  onAllergyChange: (index: number, value: string) => void
  message: string
  onMessage: (value: string) => void
  sending: boolean
  hasError: boolean
  errorText: string
  onBack: () => void
  onSubmit: () => void
}

export default function DetailsStep({ qOpacity, attendees, onAllergyChange, message, onMessage, sending, hasError, errorText, onBack, onSubmit }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, transition: 'opacity .28s ease', opacity: qOpacity }}>
      <div className="brollop-eyebrow" style={{ textAlign: 'center' }}>Några sista detaljer</div>
      <div className="brollop-script" style={{ fontSize: 30, lineHeight: 1.45 }}>Några sista detaljer</div>

      {attendees.map((p) => (
        <label key={p.index} style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, fontWeight: 500 }}>
          Allergier / kostönskemål — {p.namn}
          <input
            type="text"
            value={p.allergier}
            onChange={(e) => onAllergyChange(p.index, e.target.value)}
            className="brollop-field-line small"
          />
        </label>
      ))}

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, fontWeight: 500 }}>
        Hälsning till oss
        <textarea rows={3} value={message} onChange={(e) => onMessage(e.target.value)} className="brollop-field-box" />
      </label>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}>
        <button onClick={onBack} className="brollop-btn-secondary">TILLBAKA</button>
        <button onClick={onSubmit} className="brollop-btn-primary" style={{ flex: 1 }}>{sending ? 'SKICKAR …' : 'SKICKA ANMÄLAN'}</button>
      </div>
      {hasError && <div style={{ fontSize: 12.5, lineHeight: 1.6, textAlign: 'center' }}>{errorText}</div>}
    </div>
  )
}
