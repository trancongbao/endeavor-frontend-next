import { kysely } from '../../../db/kysely'
import _ from 'lodash'
import Browser from './Browser/Browser'
import AddSubdeck from './Browser/AddSubdeck'

export default async function Page({ params }: { params: { id: string } }) {
  const data: Row[] = await queryData(params.id)
  console.log('data: ', data)
  const { courseId, courseLevel, courseTitle } = data[0]

  const subdeckRows: SubdeckRows = _.groupBy(data, 'lessonOrder')
  console.log('subdeckRows: ', subdeckRows)

  return (
    <div className="flex flex-col gap-4">
      <AddSubdeck />
      <p className="col-span-full border-b-2 text-xl font-bold">{`Level ${courseLevel} - ${courseTitle}`}</p>
      <Browser subdeckRows={subdeckRows} />
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
    .leftJoin('card_word', 'card_word.card_id', 'card.id')
    .leftJoin('word', 'word.id', 'card_word.word_id')
    .select([
      'course.id as courseId',
      'course.level as courseLevel',
      'course.title as courseTitle',
      'lesson.order as lessonOrder',
      'lesson.title as lessonTitle',
      'card.id as cardId',
      'card.order as cardOrder',
      'card.text as cardText',
      'card_word.word_order as wordOrder',
      'word.id as wordId',
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

export type Row = {
  courseId: number
  courseLevel: number
  courseTitle: string
  lessonOrder: number | null
  lessonTitle: string | null
  cardId: number | null
  cardOrder: number | null
  cardText: string | null
  wordOrder: number | null
  wordId: number | null
  wordText: string | null
  wordDefinition: string | null
  wordPhonetic: string | null
  wordPartOfSpeech: string | null
  wordAudioUri?: string | null
  wordImageUri?: string | null
}

export type SubdeckRows = {
  [key: string]: Row[]
}
