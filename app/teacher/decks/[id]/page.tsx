import { kysely } from '../../../db/kysely'
import _ from 'lodash'
import Browser from './Browser/Browser'

export default async function Page({ params }: { params: { id: string } }) {
  const deckRows: DeckRow[] = await queryData(params.id)
  console.log('deckRows: ', deckRows)
  const { courseId, courseLevel, courseTitle } = deckRows[0]

  return (
    <div className="flex flex-col gap-4">
      <p className="col-span-full border-b-2 text-xl font-bold">{`Level ${courseLevel} - ${courseTitle}`}</p>
      <Browser deckRows={deckRows} />
    </div>
  )
}

async function queryData(id: string) {
  /*
   * TODO: authentication and authorization
   */
  const username = 'teacher1'

  return await kysely
    .selectFrom('teacher_course')
    .innerJoin('course', 'course.id', 'teacher_course.course_id')
    .leftJoin('lesson', 'lesson.course_id', 'course.id')
    .leftJoin('card', (join) =>
      join.onRef('card.course_id', '=', 'lesson.course_id').onRef('card.lesson_order', '=', 'lesson.order')
    )
    .leftJoin('card_word', (join) =>
      join
        .onRef('card_word.course_id', '=', 'card.course_id')
        .onRef('card_word.lesson_order', '=', 'card.lesson_order')
        .onRef('card_word.card_order', '=', 'card.order')
    )
    .leftJoin('word', (join) =>
      join.onRef('word.text', '=', 'card_word.word_text').onRef('word.definition', '=', 'card_word.word_definition')
    )
    .select([
      'course.id as courseId',
      'course.level as courseLevel',
      'course.title as courseTitle',
      'lesson.order as lessonOrder',
      'lesson.title as lessonTitle',
      'card.order as cardOrder',
      'card.text as cardText',
      'card_word.start_index as wordStartIndex',
      'card_word.end_index as wordEndIndex',
      'word.text as wordText',
      'word.definition as wordDefinition',
      'word.phonetic as wordPhonetic',
      'word.part_of_speech as wordPartOfSpeech',
      'word.audio_uri as wordAudioUri',
      'word.image_uri as wordImageUri',
    ])
    .where('teacher_course.teacher_username', '=', username)
    .where('teacher_course.course_id', '=', parseInt(id))
    .execute()
    .then((rows) => {
      return rows
    })
}

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
  wordDefinition?: string | null
  wordPhonetic?: string | null
  wordPartOfSpeech?: string | null
  wordAudioUri?: string | null
  wordImageUri?: string | null
}

export type SubdeckRow = DeckRow & {
  lessonOrder: number
  lessonTitle: string
}
