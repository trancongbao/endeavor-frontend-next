import { kysely } from '../../../db/kysely'

export default async function Page({ params }: { params: { id: string } }) {
  const subdecks = await getSubdecks(params.id)
  console.log('subdecks: ', subdecks)

  const { courseId, courseLevel, courseTitle } = subdecks[0]

  return (
    <div className="flex gap-4">
      <div className="basis-80 border-r-4 grid grid-rows-3">
        <p className="text-xl font-bold">{`Level ${courseLevel} - ${courseTitle}`}</p>
        {subdecks.map((subdeck) => {
          const { lessonId, lessonOrder, lessonTitle } = subdeck
          return (
            <div key={lessonId} className="flex flex-col justify-between">
              <p>{`${lessonOrder}. ${lessonTitle}`}</p>
            </div>
          )
        })}
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
    // .innerJoin('card', 'card.lesson_id', 'lesson.id')
    // .innerJoin('card_word', 'card_word.card_id', 'card.id')
    // .innerJoin('word', 'word.id', 'card_word.word_id')
    .select([
      'course.id as courseId',
      'course.level as courseLevel',
      'course.title as courseTitle',
      'lesson.id as lessonId',
      'lesson.lesson_order as lessonOrder',
      'lesson.title as lessonTitle',
      //   'card.id as card_id',
      //   'card.card_order as card_order',
      //   'card.front_text as card_front_text',
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
