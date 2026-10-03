import type { ReactNode } from 'react'

export default function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="brollop-frame">
      <div aria-hidden="true" className="brollop-frame-bg">
        <div className="ram-top" />
        <div className="ram-mid" />
        <div className="ram-bot" />
      </div>
      <div className="brollop-content">{children}</div>
    </div>
  )
}
