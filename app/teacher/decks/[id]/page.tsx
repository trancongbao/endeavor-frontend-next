import { kysely } from '../../../db/kysely'
import _ from 'lodash'
import Browser from './Browsers'

export default async function Page({ params }: { params: { id: string } }) {
  const data = await queryData(params.id)
  console.log('data: ', data)
  const { courseId, courseLevel, courseTitle } = data[0]

  const subdecks = _.groupBy(data, 'lessonOrder')
  console.log('subdecks: ', subdecks)

  return (
    <div className="flex flex-col gap-4">
      <p className="col-span-full border-b-2 text-xl font-bold">{`Level ${courseLevel} - ${courseTitle}`}</p>
      <Browser subdecks={subdecks} />
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
