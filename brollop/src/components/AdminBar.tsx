import type { Person } from '../types'

function escapeCsv(v: unknown): string {
  return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'
}

function downloadCsv(family: Person[]) {
  const cols: (keyof Person)[] = ['namn', 'vigsel', 'rundvandring', 'brollop', 'kor_bil', 'allergier']
  const body = family.map((p) =>
    cols.map((c) => escapeCsv(typeof p[c] === 'boolean' ? (p[c] ? 'JA' : 'NEJ') : p[c])).join(','),
  )
  const blob = new Blob(['﻿' + [cols.join(',')].concat(body).join('\r\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'osa-svar.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function AdminBar({ family }: { family: Person[] }) {
  return (
    <div className="brollop-admin-bar">
      <span>{family.length} svar sparade</span>
      <button onClick={() => downloadCsv(family)}>LADDA NER CSV</button>
    </div>
  )
}
