export default function NoStep({ onBackToGreet }: { onBackToGreet: () => void }) {
  return (
    <div style={{ width: '100%', paddingTop: 'calc(var(--w) * 0.14)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 26, textAlign: 'center' }}>
      <div className="brollop-script" style={{ fontSize: 30, lineHeight: 1.45 }}>Vi kommer sakna dig</div>
      <div style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.9 }}>Tack för att du svarade. Hör gärna av dig ändå — vi ses snart på annat håll.</div>
      <div className="brollop-photo-frame">
        <img src="/brollop/uploads/PXL_20260903_133805352.TS-000.MP.jpg" alt="Erik och Eli" style={{ aspectRatio: '3/4', objectPosition: '50% 62%' }} />
      </div>
      <button onClick={onBackToGreet} className="brollop-btn-link">Ändra svar</button>
    </div>
  )
}
