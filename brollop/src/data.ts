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
  { time: '12:00', what: 'Lunchmottagning' },
  { time: '14:00', what: 'Fri hopp och lek (incheckning, resa till Halden m.m.)' },
  { time: '16:00', what: 'Guidad tur på Fredriksten fästning' },
  { time: '17:00', what: 'Fördrink' },
  { time: '18:00', what: 'Middag och fest!!' },
]

export type Question = {
  key: 'vigsel' | 'brollop' | 'kor_bil'
  title: string
  meta: string
  image?: 'church' | 'tour' | 'photo'
  type?: 'car'
}

export const questions: Question[] = [
  { key: 'vigsel', title: 'Kommer ni på vigseln?', meta: 'Kl 11:00 · Näsinge kyrka · 5 juni 2027', image: 'church' },
  { key: 'brollop', title: 'Kommer ni på bröllopsmiddagen?', meta: 'Kl 18:00 · Middag, rundvandring och fest på fästningen', image: 'photo' },
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
    title: 'Klädsel till kvällen',
    html: 'Vi kommer att ha en historiskt inspirerad bröllopsfest, och önskar att ni också deltar i det om ni har möjlighet! Men vi vill att ni ska känna er bekväma och ha kul, så de är absolut inget tvång, se det som en möjlighet ;) ;) <br/> <br/> <i> Klädkod:</i> Mörk kostym / Historiskt inspirerad klädsel <br/> <br/> Saknar du inspiration? Titta på Ella den Förtrollade, En riddares historia eller varför inte Sagan om ringen eller Game of Thrones? (Elis syster vill gå i en rustning så då vet ni var ribban ligger) Gå loss!',
  },
  {
    title: 'Klädsel till vigseln',
html: 'Sommarfint eller något ni är bekväma i!'
  },
  {
    title: 'Hotell och övernattning',
    html: 'Det är gångavstånd till festlokalen från samtliga hotell. Närmast och utan höjdskillnad ligger <a href="https://fredrikstenhotell.no/" target="_blank" rel="noopener">Fredriksten Hotell</a> och <a href="https://visitnorway.se/listings/fredriksten-camping/16202/" target="_blank" rel="noopener">Fredriksten Camping</a>, som ligger direkt på fästningen.<br> <br> Andra alternativ är <a href="https://grandhotelhalden.no/" target="_blank" rel="noopener">Grand Hotel Halden</a> och <a href="https://www.google.com/maps/search/?api=1&query=Thon+Hotel+Halden+Langbrygga+1+1767+Halden" target="_blank" rel="noopener">Thon Hotel Halden</a> som ligger nedanför fästningen i Halden centrum. Strömstad når man med bil på 30 minuter.',
  },
  
  {
    title: 'Näsinge kyrka',
    html: '<a href="https://www.google.com/maps/search/?api=1&query=N%C3%A4singe+kyrka" target="_blank" rel="noopener">Visa på kartan</a>',
  },
  {
    title: 'Lunchmottagning',
    html: '<a href="https://www.google.com/maps/place/%C3%96ssby+Norrg%C3%A5rden+1,+452+93+Str%C3%B6mstad/@59.0236791,11.3496937" target="_blank" rel="noopener">Visa på kartan</a>',
  },
  {
    title: 'Fredriksten fästning',
    html: 'Bröllopsfesten kommer att vara i Kongshallene på Fredriksten fästning. Fästningen ligger mitt i norska Halden, precis över riksgränsen från Strömstad. Det var på denna fästningen som Karl XII gick mot sin sista vila efter att han tagit sin armé via Näsinge över gränsen. Nu gör vi samma resa fast i kärlekens tecken <333 <a href="https://www.google.com/maps/search/?api=1&query=Fredriksten+festning+Halden" target="_blank" rel="noopener">Visa på kartan</a>',
  },
  {
    title: 'Tal',
    html: 'Vill du hålla tal eller spexa på något sätt? kontakta Linnéa Bark på <a href="tel:+46735430537">073-543 05 37</a>!',
  },
  {
    title: 'Bröllopsgåva',
    html: 'Er närvaro på denna dag är den finaste present vi kan få! Vill ni ändå ge något får ni gärna swisha till vår smekmånad till <a href="tel:+46705675328">070-567 53 28</a>.',
  },
]

export const testFamilies: Record<string, string[]> = {
  'erik karlkvist': ['Erik Karlkvist', 'Eli Knoph'],
  'eli knoph': ['Eli Knoph', 'Erik Karlkvist'],
}
