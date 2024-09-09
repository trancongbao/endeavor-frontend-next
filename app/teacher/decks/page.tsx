import { kysely } from '../../db/kysely'
import DeckTile from './DeckTile'

export default async function Decks() {
  const decks = await getDecks()
  console.log('decks: ', decks)

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
      {decks.map((deck) => {
        return <DeckTile key={deck.id} deck={deck} />
      })}
    </div>
  )
}

async function getDecks() {
  /*
   * TODO: authentication and authorization
   */
  const username = 'teacher1'

  return await kysely
    .selectFrom('teacher_course')
    .innerJoin('course', 'course.id', 'teacher_course.course_id')
    .leftJoin('lesson', 'lesson.course_id', 'course.id')
    .select([
      'course.id as courseId',
      'course.level as courseLevel',
      'course.title as courseTitle',
      'lesson.order as lessonOrder',
      'lesson.title as lessonTitle',
    ])
    .where('teacher_course.teacher_username', '=', username)
    .execute()
    .then((rows) => {
      const courses: {
        id: number
        level: number
        title: string
        subdecks: { order: number; title: string }[]
      }[] = []
      rows.forEach(({ courseId, courseLevel, courseTitle, lessonOrder, lessonTitle }) => {
        const course = courses.find((course) => course.id === courseId)
        if (lessonOrder !== null && lessonTitle !== null) {
          const lesson = {
            order: lessonOrder,
            title: lessonTitle,
          }
          if (course === undefined) {
            courses.push({
              id: courseId,
              level: courseLevel,
              title: courseTitle,
              subdecks: [lesson],
            })
          } else {
            course.subdecks.push(lesson)
          }
        } else {
          if (course === undefined) {
            courses.push({
              id: courseId,
              level: courseLevel,
              title: courseTitle,
              subdecks: [],
            })
          }
        }
      })

      return courses
    })
}
