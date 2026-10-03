import type { FormEvent } from 'react'
import { couple } from '../data'

type Phase = 'idle' | 'fading' | 'playing' | 'artOut'

type Props = {
  phase: Phase
  leaning: boolean
  nameInput: string
  onNameInput: (value: string) => void
  onSubmit: (e: FormEvent) => void
  looking: boolean
  hasError: boolean
  errorText: string
}

export default function NameStep({ phase, leaning, nameInput, onNameInput, onSubmit, looking, hasError, errorText }: Props) {
  const anim = phase === 'playing' || phase === 'artOut'
  const artOpacity = phase === 'artOut' ? 0 : 1
  const copyOpacity = phase === 'artOut' ? 0 : 1
  const copyShift = phase === 'artOut' ? '-24px' : '0px'
  const copyDown = phase === 'artOut' ? '24px' : '0px'
  const copyPointer = phase === 'idle' ? 'auto' : 'none'
  const artFilter = anim ? 'url(#brollop-wind)' : 'none'
  const swayAnim = anim ? 'brollop-sway 2.6s ease-in-out infinite' : 'none'
  const leanTransform = leaning ? 'rotate(9deg) translateX(14px)' : 'rotate(0deg) translateX(0px)'
  const notesOpacity = anim ? 1 : 0
  const toot = (delay: number) => (anim ? `brollop-toot 2.4s ease-out infinite ${delay}s` : 'none')
  const toot2 = (delay: number) => (anim ? `brollop-toot 2.9s ease-out infinite ${delay}s` : 'none')

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="brollop-wind">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.014" numOctaves={2} seed={7} result="n">
              <animate attributeName="baseFrequency" dur="7s" values="0.006 0.014;0.011 0.02;0.006 0.014" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="n" scale={8} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div style={{ position: 'relative', width: '86%', aspectRatio: '999/563', marginTop: 'calc(var(--w) * 0.03)', transition: 'opacity .6s ease', opacity: artOpacity }}>
        <div style={{ width: '100%', height: '100%', transformOrigin: '70% 100%', transform: leanTransform, transition: 'transform .7s cubic-bezier(.2,.7,.3,1)' }}>
          <div style={{ width: '100%', height: '100%', transformOrigin: '50% 100%', animation: swayAnim }}>
            <img src="/brollop/gubbarna.png" alt="Två gubbar blåser i trumpet" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain', filter: artFilter }} />
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: notesOpacity }}>
          <div style={{ position: 'absolute', left: '6%', top: '18%', fontSize: 34, lineHeight: 1, opacity: 0, transformOrigin: '100% 50%', animation: toot(0) }}>♪</div>
          <div style={{ position: 'absolute', left: '6%', top: '18%', fontSize: 27, lineHeight: 1, opacity: 0, transformOrigin: '100% 50%', animation: toot(0.8) }}>♫</div>
          <div className="brollop-script" style={{ position: 'absolute', left: '6%', top: '18%', fontSize: 19, lineHeight: 1, whiteSpace: 'nowrap', opacity: 0, transformOrigin: '100% 50%', animation: toot(1.6) }}>trudelidutt</div>
          <div style={{ position: 'absolute', left: '0%', top: '56%', fontSize: 30, lineHeight: 1, opacity: 0, transformOrigin: '100% 50%', animation: toot2(0.4) }}>♫</div>
          <div style={{ position: 'absolute', left: '0%', top: '56%', fontSize: 24, lineHeight: 1, opacity: 0, transformOrigin: '100% 50%', animation: toot2(1.3) }}>♬</div>
          <div className="brollop-script" style={{ position: 'absolute', left: '0%', top: '56%', fontSize: 17, lineHeight: 1, whiteSpace: 'nowrap', opacity: 0, transformOrigin: '100% 50%', animation: toot2(2.1) }}>trudelidutt</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'calc(var(--w) * 0.08)', transition: 'opacity .5s ease, transform .5s ease', opacity: copyOpacity, transform: `translateY(${copyShift})` }}>
        <div style={{ fontSize: 12, letterSpacing: 2.5, fontWeight: 500 }}>BRÖLLOP</div>
        <div className="brollop-script" style={{ fontSize: 'clamp(34px,10.5vw,48px)', lineHeight: 1.45, marginTop: 14 }}>{couple.names}</div>
        <div style={{ fontSize: 12, letterSpacing: 1.5, fontWeight: 500, lineHeight: 1.6, marginTop: 8, textWrap: 'balance' }}>
          {couple.dateLabel}<br />{couple.venueLabel}
        </div>
      </div>

      <div className="brollop-script" style={{ fontSize: 26, lineHeight: 1.45, marginTop: 34, transition: 'opacity .5s ease, transform .5s ease', opacity: copyOpacity, transform: `translateY(${copyDown})` }}>
        Vad heter du?
      </div>
      <form
        onSubmit={onSubmit}
        style={{ width: '84%', marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16, transition: 'opacity .5s ease, transform .5s ease', opacity: copyOpacity, transform: `translateY(${copyDown})`, pointerEvents: copyPointer as 'auto' | 'none' }}
      >
        <input
          type="text"
          required
          placeholder="För- och efternamn"
          value={nameInput}
          onChange={(e) => onNameInput(e.target.value)}
          className="brollop-field-line"
        />
        <button type="submit" className="brollop-btn-primary">{looking ? 'SÖKER …' : 'FORTSÄTT'}</button>
        {hasError && <div style={{ fontSize: 13, lineHeight: 1.6, textAlign: 'center' }}>{errorText}</div>}
      </form>
    </div>
  )
}
