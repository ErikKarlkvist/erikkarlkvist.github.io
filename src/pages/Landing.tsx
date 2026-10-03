import './Landing.css'

export default function Landing() {
    return (
        <div className="wedding-landing">
            <div className="wedding-landing-frame">
                <div aria-hidden="true" className="wedding-landing-frame-bg">
                    <div className="ram-top" />
                    <div className="ram-mid" />
                    <div className="ram-bot" />
                </div>
                <div className="wedding-landing-content">
                    <img
                        src="/brollop/gubbarna.png"
                        alt="Två gubbar blåser i trumpet"
                        style={{ width: '86%', marginTop: 'calc(var(--w) * 0.03)', objectFit: 'contain' }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'calc(var(--w) * 0.08)' }}>
                        <div style={{ fontSize: 12, letterSpacing: 2.5, fontWeight: 500 }}>BRÖLLOP</div>
                        <div className="wedding-landing-script" style={{ fontSize: 'clamp(34px,10.5vw,48px)', lineHeight: 1.45, marginTop: 14 }}>
                            Eli &amp; Erik
                        </div>
                        <div style={{ fontSize: 12, letterSpacing: 1.5, fontWeight: 500, lineHeight: 1.6, marginTop: 8, textWrap: 'balance' }}>
                            5 JUNI 2027<br />NÄSINGE KYRKA &amp; FREDRIKSTEN FÄSTNING
                        </div>
                    </div>

                    <a href="/brollop/" className="wedding-landing-btn" style={{ marginTop: 40 }}>
                        Gå till anmälan
                    </a>
                </div>
            </div>
        </div>
    )
}
