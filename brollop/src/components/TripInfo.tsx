import { practicalInfo, schedule } from '../data'

export default function TripInfo() {
  return (
    <>
    <div> 
      Vad kul att ni vill komma på vårt bröllop! Här är lite praktisk information om dagen och schemat för bröllopsdagen!
    </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div className="brollop-eyebrow" style={{ marginBottom: 12 }}>HELA SCHEMAT 5E JUNI</div>
        {schedule.map((item) => (
          <div className="brollop-schedule-row" key={item.time}>
            <div className="time">{item.time}</div>
            <div className="what">{item.what}</div>
          </div>
        ))}
        <div style={{ borderTop: '1.5px solid var(--ink)' }} />
      </div>
      <div className="brollop-card">
        <div className="brollop-eyebrow">BRA ATT VETA</div>
        {practicalInfo.map((item) => (
          <div key={item.title} style={{ fontSize: 14, lineHeight: 1.65 }}>
            <b>{item.title}</b>
            <br />
            <span dangerouslySetInnerHTML={{ __html: item.html }} />
          </div>
        ))}
      </div>

    </>
  )
}
