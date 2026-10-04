import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { labels, questions } from './data'
import { blankPerson, type Person } from './types'
import { lookup, send } from './api'
import Frame from './components/Frame'
import NameStep from './components/NameStep'
import GreetStep from './components/GreetStep'
import QuestionStep from './components/QuestionStep'
import DetailsStep from './components/DetailsStep'
import DoneStep from './components/DoneStep'
import NoStep from './components/NoStep'
import AdminBar from './components/AdminBar'

type Step = 'name' | 'greet' | 'yes' | 'no'
type Phase = 'idle' | 'fading' | 'playing' | 'artOut'

export default function App() {
  const [step, setStep] = useState<Step>('name')
  const [nameInput, setNameInput] = useState('')
  const [guestName, setGuestName] = useState('')
  const [family, setFamily] = useState<Person[]>([])
  const [message, setMessage] = useState('')
  const [qStep, setQStep] = useState(0)
  const [qOpacity, setQOpacity] = useState(1)
  const [doneOpacity, setDoneOpacity] = useState(0)
  const [hasSeats, setHasSeats] = useState<boolean | null>(null)
  const [returning, setReturning] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [isAdmin] = useState(() => /[?&]admin=1/.test(location.search) || location.hash === '#admin')
  const [phase, setPhase] = useState<Phase>('idle')
  const [greetIn, setGreetIn] = useState(false)
  const [leaning, setLeaning] = useState(false)
  const [looking, setLooking] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [questionError, setQuestionError] = useState('')

  const timers = useRef<number[]>([])
  const fanfare = useRef<HTMLAudioElement | null>(null)
  const leanStart = useRef(0)

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => {
    try {
      fanfare.current = new Audio('/brollop/uploads/freesound_community-success-fanfare-trumpets-6185.mp3')
      fanfare.current.preload = 'auto'
      fanfare.current.volume = 0.7
      fanfare.current.load()
    } catch {
      // ljud är inte kritiskt för att kunna OSA
    }
    return clearTimers
  }, [])

  function playFanfare() {
    try {
      const a = fanfare.current
      if (!a) return
      a.currentTime = 0
      a.play()?.catch(() => {})
    } catch {
      // ljud är inte kritiskt för att kunna OSA
    }
  }

  function startIntro(alreadySubmitted: boolean) {
    setPhase('fading')
    timers.current = [
      window.setTimeout(() => playFanfare(), 560),
      window.setTimeout(() => setPhase('playing'), 620),
      window.setTimeout(() => setPhase('artOut'), 3700),
      window.setTimeout(() => {
        setStep(alreadySubmitted ? 'yes' : 'greet')
        setQStep(0)
        setQOpacity(1)
        setGreetIn(false)
        setLeaning(false)
      }, 4250),
      window.setTimeout(() => {
        setGreetIn(true)
        setDoneOpacity(1)
      }, 4320),
    ]
  }

  function runIntro(alreadySubmitted: boolean) {
    clearTimers()
    const wait = Math.max(0, 750 - (Date.now() - leanStart.current))
    timers.current = [window.setTimeout(() => startIntro(alreadySubmitted), wait)]
  }

  async function handleNameSubmit(e: FormEvent) {
    e.preventDefault()
    if (looking) return
    leanStart.current = Date.now()
    setLooking(true)
    setLeaning(true)
    setError('')
    try {
      const r = await lookup(nameInput)
      const mine = (r.familj || []).find((p) => p.namn.trim().toLowerCase() === r.namn.trim().toLowerCase())
      const bil = mine ? String(mine.kor_bil || '').trim().toUpperCase() : ''
      const alreadySubmitted = !!mine?.svarat
      setGuestName(r.namn || nameInput.trim())
      setFamily(
        (r.familj || []).map((p) =>
          p.svarat
            ? { ...blankPerson(p.namn), ...p }
            : { ...blankPerson(p.namn), ...p, vigsel: null, rundvandring: null, brollop: null },
        ),
      )
      setMessage(r.meddelande || '')
      setHasAnswered(alreadySubmitted)
      setReturning(alreadySubmitted)
      setSubmitted(alreadySubmitted)
      setHasSeats(bil === 'JA' || parseInt(bil, 10) > 0 ? true : bil === 'NEJ' ? false : null)
      setLooking(false)
      setQStep(0)
      setQOpacity(1)
      setDoneOpacity(0)
      runIntro(alreadySubmitted)
    } catch (err) {
      setLooking(false)
      setLeaning(false)
      const notFound = (err as { notFound?: boolean } | null)?.notFound
      setError(notFound ? 'Ditt namn hittades inte. Kontakta Erik och Eli om det är fel.' : 'Kunde inte nå gästlistan just nu. Försök igen om en stund.')
    }
  }

  function backToName() {
    clearTimers()
    if (fanfare.current) {
      fanfare.current.pause()
      fanfare.current.currentTime = 0
    }
    setStep('name')
    setPhase('idle')
    setGreetIn(false)
    setLeaning(false)
  }

  function backToGreet() {
    setSubmitted(false)
    setStep('greet')
    setGreetIn(true)
  }

  function answerYes() {
    setStep('yes')
    setQStep(0)
    setQOpacity(1)
  }

  function patch<K extends keyof Person>(i: number, key: K, value: Person[K]) {
    setFamily((fam) => fam.map((p, j) => (j === i ? { ...p, [key]: value } : p)))
    setQuestionError('')
  }

  const isMe = (p: Person) => p.namn.trim().toLowerCase() === guestName.trim().toLowerCase()
  const isAttending = (p: Person) => !!(p.vigsel || p.rundvandring || p.brollop)
  const hasAnsweredAnything = (p: Person) => p.vigsel !== null || p.rundvandring !== null || p.brollop !== null

  function move(delta: number) {
    let next = qStep + delta
    const current = questions[qStep]
    const me = family.find(isMe)
    if (delta > 0 && current && current.type !== 'car') {
      const key = current.key as 'vigsel' | 'brollop'
      if (me && me[key] === null) {
        setQuestionError('Svara JA eller NEJ för dig själv innan du går vidare.')
        return
      }
    }
    setQuestionError('')
    // Bilfrågan är onödig om man själv har tackat nej till allt.
    if (questions[next]?.type === 'car' && me?.vigsel === false && me?.brollop === false) {
      setHasSeats(null)
      next += delta
    }
    if (next < 0) {
      clearTimers()
      setStep('greet')
      setGreetIn(true)
      setQStep(0)
      setQOpacity(1)
      return
    }
    setQOpacity(0)
    timers.current.push(
      window.setTimeout(() => {
        setQStep(next)
        setQOpacity(1)
      }, 260),
    )
  }

  async function submitYes() {
    if (sending) return
    setSending(true)
    setError('')
    try {
      await send({
        avsandare: guestName,
        meddelande: message,
        // Bara de som faktiskt har fått svar skickas, så att övriga i familjen kan svara själva senare.
        personer: family
          .filter((p) => isMe(p) || hasAnsweredAnything(p))
          .map((p) => ({
            namn: p.namn,
            vigsel: p.vigsel,
            rundvandring: p.rundvandring,
            brollop: p.brollop,
            kor_bil: isMe(p) ? (hasSeats ? 'JA' : 'NEJ') : p.kor_bil,
            allergier: p.allergier,
          })),
      })
      setSending(false)
      setSubmitted(true)
      setHasAnswered(true)
      setReturning(false)
      if (!family.some(isAttending)) {
        setStep('no')
        return
      }
      setDoneOpacity(0)
      playFanfare()
      timers.current.push(window.setTimeout(() => setDoneOpacity(1), 60))
    } catch {
      setSending(false)
      setError('Kunde inte nå servern. Försök igen om en stund eller hör av dig till oss.')
    }
  }

  const namn = guestName || nameInput
  const first = namn.trim().split(' ')[0] || ''
  const others = family.filter((p) => p.namn.trim().toLowerCase() !== namn.trim().toLowerCase())
  const otherFirst = others.map((p) => p.namn.trim().split(' ')[0])
  const list =
    otherFirst.length === 0
      ? ''
      : otherFirst.length === 1
        ? otherFirst[0]
        : otherFirst.slice(0, -1).join(', ') + ' och ' + otherFirst[otherFirst.length - 1]
  const askLine = list
    ? 'Varmt välkommen till vårt bröllop.\nVi hoppas att ni kan komma!'
    : 'Varmt välkommen till vårt bröllop.\nVi hoppas att du kan komma!'

  const q = questions[qStep] || null
  const isQuestion = step === 'yes' && !submitted && !!q
  const isDetails = step === 'yes' && !submitted && !q

  const summary = family.map((p) => {
    if (!hasAnsweredAnything(p)) return { namn: p.namn, text: 'har inte svarat än' }
    const parts = (['vigsel', 'rundvandring', 'brollop'] as const).filter((k) => p[k]).map((k) => labels[k])
    if (!parts.length) return { namn: p.namn, text: 'kommer inte' }
    const text = parts.length === 1 ? parts[0] : parts.slice(0, -1).join(', ') + ' och ' + parts[parts.length - 1]
    return { namn: p.namn, text }
  })

  const attendees = family
    .map((p, i) => ({ p, i }))
    .filter((x) => isAttending(x.p))
    .map((x) => ({ index: x.i, namn: x.p.namn, allergier: x.p.allergier }))

  return (
    <div className="brollop">
      <Frame>
        {step === 'name' && (
          <NameStep
            phase={phase}
            leaning={leaning}
            nameInput={nameInput}
            onNameInput={setNameInput}
            onSubmit={handleNameSubmit}
            looking={looking}
            hasError={!!error}
            errorText={error}
          />
        )}

        {step === 'greet' && (
          <GreetStep
            greetIn={greetIn}
            greetLine={`Hej ${first}!`}
            askLine={askLine}
            buttonLabel={list ? 'ANMÄL ER HÄR' : 'ANMÄL DIG HÄR'}
            hasPrevious={hasAnswered}
            onStart={answerYes}
            onBackToName={backToName}
          />
        )}

        {step === 'yes' && (
          <div style={{ width: '100%', paddingTop: 'calc(var(--w) * 0.16)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
            {isQuestion && q && (
              <QuestionStep
                qOpacity={qOpacity}
                qLabel={`STEG ${qStep + 1} AV ${questions.length + 1}`}
                question={q}
                family={family}
                onTogglePerson={(i, key, value) => patch(i, key, value)}
                hasSeats={hasSeats}
                onToggleCar={(value) => setHasSeats(value)}
                onBack={() => move(-1)}
                onNext={() => move(1)}
                errorText={questionError}
              />
            )}

            {isDetails && (
              <DetailsStep
                qOpacity={qOpacity}
                attendees={attendees}
                onAllergyChange={(i, value) => patch(i, 'allergier', value)}
                message={message}
                onMessage={setMessage}
                sending={sending}
                hasError={!!error}
                errorText={error}
                onBack={() => move(-1)}
                onSubmit={submitYes}
              />
            )}

            {submitted && (
              <DoneStep
                doneOpacity={doneOpacity}
                doneTitle={returning ? `Hej igen ${first}!` : `Tack ${first}!`}
                doneNote={returning ? 'Ni har redan anmält er. Vill ni ändra något? Kontakta Erik eller Eli.' : 'Din anmälan är mottagen.'}
                summary={summary}
                hasSeats={!!hasSeats}
              />
            )}
          </div>
        )}

        {step === 'no' && <NoStep onBackToGreet={backToGreet} />}
      </Frame>

      {isAdmin && <AdminBar family={family} />}
    </div>
  )
}
