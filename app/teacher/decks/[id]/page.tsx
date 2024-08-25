import { kysely } from '../../../db/kysely'
import _ from 'lodash'

export default async function Page({ params }: { params: { id: string } }) {
  const joinedRows = await getSubdecks(params.id)
  console.log('rows: ', joinedRows)
  const { courseId, courseLevel, courseTitle } = joinedRows[0]

  const subdecks = _.groupBy(joinedRows, 'lessonOrder')
  console.log('subdecks: ', subdecks)

  return (
    <div className="grid grid-cols-[1fr_2fr_4fr] grid-rows-[1fr_10fr] gap-4">
      <p className="col-span-full border-b-2 text-xl font-bold">{`Level ${courseLevel} - ${courseTitle}`}</p>
      <div className="basis-80 border-r-4 flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {Object.entries(subdecks).map(([subdeckOrder, rows]) => {
            return <p key={subdeckOrder} className="hover:bg-blue-200">{`${rows[0].lessonTitle}`}</p>
          })}
        </div>
        <button className="w-36 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Sub-deck
        </button>
      </div>
      <div className="basis-80 border-r-4">
        <button className="w-36 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add card</button>
      </div>
      <div>Preview/Edit Toggle</div>
    </div>
  )
}

async function getSubdecks(id: string) {
  /*
   * TODO: authentication and authorization
   */
  const username = 'teacher1'

  return await kysely
    .selectFrom('teacher_course')
    .innerJoin('course', 'course.id', 'teacher_course.course_id')
    .innerJoin('lesson', 'lesson.course_id', 'course.id')
    .innerJoin('card', (join) =>
      join.onRef('card.course_id', '=', 'lesson.course_id').onRef('card.lesson_order', '=', 'lesson.order')
    )
    // .innerJoin('card_word', 'card_word.card_id', 'card.id')
    // .innerJoin('word', 'word.id', 'card_word.word_id')
    .select([
      'course.id as courseId',
      'course.level as courseLevel',
      'course.title as courseTitle',
      'lesson.order as lessonOrder',
      'lesson.title as lessonTitle',
      'card.id as card_id',
      'card.order as card_order',
      'card.text as card_text',
      //   'card_word.word_order as word_order',
      //   'word.id as word_id',
      //   'word.word as word_word',
      //   'word.definition as word_definition',
      //   'word.phonetic as word_phonetic',
      //   'word.part_of_speech as word_part_of_speech',
      //   'word.audio_uri as word_audio_uri',
      //   'word.image_uri as word_image_uri',
    ])
    .where('teacher_course.teacher_username', '=', username)
    .where('teacher_course.course_id', '=', parseInt(id))
    .execute()
    .then((rows) => {
      return rows
    })
}

async function Subdecks({ subdecks }) {
  return (
    <div className="basis-80 border-r-4 flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {Object.entries(subdecks).map(([subdeckOrder, rows]) => {
            return <p key={subdeckOrder} className="hover:bg-blue-200">{`${rows[0].lessonTitle}`}</p>
          })}
        </div>
        <button className="w-36 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Sub-deck
        </button>
      </div>
  )
}
