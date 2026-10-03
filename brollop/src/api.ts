import { apiUrl, testFamilies } from './data'
import { blankPerson, type LookupResult, type Person } from './types'

const STORE = 'brollop-osa-svar'

export function localLookup(name: string): LookupResult {
  const key = name.trim().toLowerCase().replace(/\s+/g, ' ')
  const names = testFamilies[key] || [name.trim()]
  return { namn: name.trim(), familj: names.map((n) => blankPerson(n)), meddelande: '', harSvarat: false }
}

export async function lookup(name: string): Promise<LookupResult> {
  if (!apiUrl) return localLookup(name)
  const url = apiUrl + (apiUrl.indexOf('?') > -1 ? '&' : '?') + 'action=lookup&namn=' + encodeURIComponent(name.trim())
  const data = await (await fetch(url)).json()
  if (!data.ok) throw new Error(data.error || 'fel')
  if (!data.found) {
    const e = new Error('okänd') as Error & { notFound?: boolean }
    e.notFound = true
    throw e
  }
  return data
}

export type SendPayload = {
  avsandare: string
  meddelande: string
  personer: Pick<Person, 'namn' | 'vigsel' | 'rundvandring' | 'brollop' | 'kor_bil' | 'allergier'>[]
}

export function send(payload: SendPayload): Promise<void> {
  try {
    localStorage.setItem(STORE, JSON.stringify(payload))
  } catch {
    // webbläsaren kan ha stängt av lagring, inget att göra åt det
  }
  if (!apiUrl) return Promise.resolve()
  return fetch(apiUrl, { method: 'POST', body: JSON.stringify(payload) })
    .then((r) => r.json())
    .then((d) => {
      if (!d.ok) throw new Error(d.error || 'fel')
    })
}
