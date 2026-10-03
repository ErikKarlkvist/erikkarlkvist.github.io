export type Person = {
  namn: string
  vigsel: boolean | null
  rundvandring: boolean | null
  brollop: boolean | null
  kor_bil: string
  allergier: string
  svarat: boolean
}

export function blankPerson(namn: string): Person {
  return {
    namn,
    vigsel: null,
    rundvandring: null,
    brollop: null,
    kor_bil: '',
    allergier: '',
    svarat: false,
  }
}

export type LookupResult = {
  namn: string
  familj: Person[]
  meddelande: string
  harSvarat: boolean
}
