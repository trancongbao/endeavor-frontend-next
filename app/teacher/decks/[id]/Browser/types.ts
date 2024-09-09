export type DeckRow = {
  courseId: number
  courseLevel: number
  courseTitle: string
  lessonOrder: number | null
  lessonTitle: string | null
  cardOrder: number | null
  cardText: string | null
  wordStartIndex: number | null
  wordEndIndex: number | null
  wordText: string | null
  wordDefinition: string | null
  wordPhonetic?: string | null
  wordPartOfSpeech?: string | null
  wordAudioUri?: string | null
  wordImageUri?: string | null
}

export type SubdeckRow = DeckRow & {
  lessonOrder: number
  lessonTitle: string
}

export type CardRow = SubdeckRow & {
  cardOrder: number
  cardText: string
}

export type ViewWordRow = CardRow & {
  mode: 'view'
  wordStartIndex: number
  wordEndIndex: number
  wordText: string
  wordDefinition: string
}

export type AddWordFormRow = SubdeckRow & {
  mode: 'add'
  wordStartIndex: number
  wordEndIndex: number
}

export type EditWordFormRow = CardRow & {
  mode: 'edit'
  wordStartIndex: number
  wordEndIndex: number
  wordText: string
  wordDefinition: string
}

export type WordRow = ViewWordRow | AddWordFormRow | EditWordFormRow
