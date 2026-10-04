import { contactPhone } from '../data'
import TripInfo from './TripInfo'

type SummaryRow = { namn: string; text: string }

type Props = {
  doneOpacity: number
  doneTitle: string
  doneNote: string
  summary: SummaryRow[]
  hasSeats: boolean
}

export default function DoneStep({ doneOpacity, doneTitle, doneNote, summary, hasSeats }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 30, transition: 'opacity .5s ease', opacity: doneOpacity }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="brollop-script" style={{ fontSize: 34, lineHeight: 1.45 }}>{doneTitle}</div>
        <div style={{ fontSize: 14.5, lineHeight: 1.7, opacity: 0.9 }}>{doneNote}</div>
      </div>

      <div className="brollop-card">
        <div className="brollop-eyebrow">NI HAR TACKAT JA TILL</div>
        {summary.map((row) => (
          <div key={row.namn} style={{ fontSize: 14.5, lineHeight: 1.5 }}><b>{row.namn}</b> — {row.text}</div>
        ))}
        {hasSeats && <div style={{ fontSize: 14.5, lineHeight: 1.5, opacity: 0.85 }}>Ni kommer med bil.</div>}
      </div>

      <TripInfo />

      <div className="brollop-photo-frame">
        <img src="/brollop/uploads/PXL_20260903_133805352.TS-000.MP.jpg" alt="Erik och Eli" style={{ aspectRatio: '3/4', objectPosition: '50% 62%' }} />
      </div>

      <div style={{ textAlign: 'center', fontSize: 12, opacity: 0.6, lineHeight: 1.7 }}>Frågor? Hör av dig till Erik på <a href={`tel:+46${contactPhone.replace(/\D/g, '').slice(1)}`}>{contactPhone}</a></div>
    </div>
  )
}
