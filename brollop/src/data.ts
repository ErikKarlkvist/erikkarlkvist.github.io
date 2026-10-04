export const couple = {
  names: 'Eli & Erik',
  dateLabel: '5 JUNI 2027',
  venueLabel: 'NÄSINGE KYRKA & FREDRIKSTEN FÄSTNING',
}

export const contactPhone = '070-567 53 28'

export const apiUrl =
  (import.meta.env.VITE_BROLLOP_API_URL as string | undefined) ||
  'https://script.google.com/macros/s/AKfycbw2dRqYtiJ2z5r8px7EizSowXL0vMrPNHkvedupMsIRO-Y3IWvAK8mT-xLN4oMitt_qPA/exec'

export type ScheduleItem = { time: string; what: string }

export const schedule: ScheduleItem[] = [
  { time: '11:00', what: 'Vigsel i Näsinge kyrka' },
  { time: '12:00', what: 'Lunch hos Elis föräldrar' },
  { time: '13:00', what: 'Resa till Halden och incheckning' },
  { time: '16:00', what: 'Guidad tur på Fredriksten fästning' },
  { time: '17:00', what: 'Fördrink' },
  { time: '18:00', what: 'Middag och fest' },
]

export type Question = {
  key: 'vigsel' | 'brollop' | 'kor_bil'
  title: string
  meta: string
  image?: 'church' | 'tour' | 'photo'
  type?: 'car'
}

export const questions: Question[] = [
  { key: 'vigsel', title: 'Ska du på vigseln?', meta: 'Kl 11:00 · Näsinge kyrka · 5 juni 2027', image: 'church' },
  { key: 'brollop', title: 'Ska ni på bröllopsmiddagen?', meta: 'Kl 18:00 · Middag, rundvandring och fest på fästningen', image: 'photo' },
  { key: 'kor_bil', title: 'Har ni bil?', meta: 'Vi samordnar skjuts till Halden och hör av oss direkt.', type: 'car' },
]

export const labels: Record<string, string> = {
  vigsel: 'vigseln',
  rundvandring: 'rundvandringen',
  brollop: 'bröllopsmiddagen',
}

export type PracticalInfoItem = { title: string; html: string }

export const practicalInfo: PracticalInfoItem[] = [
  {
    title: 'Klädsel',
    html: 'Till vigseln är klädkoden sommarfin. Till middagen önskar vi historisk klädsel eller mörk kostym. Dags att damma av din gamla medeltidsklänning eller din 1800-tals kavaj!',
  },
  {
    title: 'Boka hotell',
    html: 'Det är gångavstånd till samtliga hotell. Närmast ligger <a href="https://fredrikstenhotell.no/" target="_blank" rel="noopener">Fredriksten Hotell</a>, direkt på fästningen.<br>Andra alternativ är <a href="https://grandhotelhalden.no/" target="_blank" rel="noopener">Grand Hotel Halden</a> och <a href="https://www.google.com/maps/search/?api=1&query=Thon+Hotel+Halden+Langbrygga+1+1767+Halden" target="_blank" rel="noopener">Thon Hotel Halden</a> – de ligger nedanför en brant backe.',
  },
  {
    title: 'Näsinge kyrka',
    html: 'Ligger belägen mitt i Näsinge, lunchen efteråt ligger ca 3km därifrån. <a href="https://www.google.com/maps/search/?api=1&query=N%C3%A4singe+kyrka" target="_blank" rel="noopener">Visa på kartan</a>',
  },
  {
    title: 'Lunchmottagning',
    html: 'Ligger på Össby Norrgården 1. <a href="https://www.google.com/maps/place/%C3%96ssby+Norrg%C3%A5rden+1,+452+93+Str%C3%B6mstad/@59.0236791,11.3496937" target="_blank" rel="noopener">Visa på kartan</a>',
  },
  {
    title: 'Fredriksten fästning',
    html: 'Festlokalen och guidningen ligger belägen på en topp mitt i Halden med en del trappor och backar, hör av er om ni skulle behöva stöd. <a href="https://www.google.com/maps/search/?api=1&query=Fredriksten+festning+Halden" target="_blank" rel="noopener">Visa på kartan</a>',
  },
  {
    title: 'Tal',
    html: 'Vill du hålla tal, kontakta Linnea på <a href="tel:+46735430537">073-543 05 37</a>.',
  },
  {
    title: 'Bröllopsgåva',
    html: 'Er närvaro på denna dag är den finaste present vi kan få! Vill ni ändå ge något får ni gärna bidra till vår smekmånad till 0705675328.',
  },
]

export const testFamilies: Record<string, string[]> = {
  'erik karlkvist': ['Erik Karlkvist', 'Eli Knoph'],
  'eli knoph': ['Eli Knoph', 'Erik Karlkvist'],
}
