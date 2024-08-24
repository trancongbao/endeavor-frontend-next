import { Generated, Insertable, sql } from 'kysely'
import { Course, kysely, Lesson, Teacher } from '../kysely'
import { teachers, courses, teacherCourses } from './data'

/*
 * We insert rows individually in several places, instead of using PostgreSQL bulk insertion.
 * This approach more closely mimics actual user operations and makes working with foreign keys easier.
 * So, for the sake of readability and maintainability, we sacrifice some performance gain.
 */

truncateTables()
  .then(() => {
    const teacherPromise = insertTeachers(teachers) // Promise of `insertTeachers`
    // Promises of `insertCourse`s
    const coursePromises = courses.map((course) => {
      const { lessons, ...courseInsertable } = course
      return insertCourse(courseInsertable).then((insertedCourse) => {
        console.log('insertedCourse: ', insertedCourse)
        course.id = insertedCourse.id
        lessons?.forEach((lesson, index) => {
          lesson.course_id = course.id
          lesson.lesson_order = index //TODO: rename to `chapter`
          insertLesson(lesson as Insertable<Lesson>).then((insertedLesson) => {
            console.log('insertedLesson: ', insertedLesson)
            lesson.id = insertedLesson.id as unknown as Generated<number>
          })
        })
      })
    })
    // Combine teacherPromise with coursePromises
    return Promise.all([teacherPromise, ...coursePromises])
  })
  .then(() => {
    teacherCourses.forEach((teacherCourses, teacher_username) => {
      teacherCourses.forEach((teacherCourse) => {
        const course_id = courses.find(
          (course) => course.level === teacherCourse.level && course.title === teacherCourse.title
        )?.id!

        console.log('courseId: ', course_id)
        return kysely
          .insertInto('teacher_course')
          .values({ teacher_username, course_id })
          .returningAll()
          .executeTakeFirstOrThrow()
      })
    })
  })

function truncateTables() {
  const snippet = sql`
    TRUNCATE TABLE course RESTART IDENTITY CASCADE;
    TRUNCATE TABLE teacher RESTART IDENTITY CASCADE;
  `
  return snippet.execute(kysely)
}

function insertTeachers(teacherInsertables: Insertable<Teacher>[]) {
  return kysely.insertInto('teacher').values(teacherInsertables).returningAll().execute()
}

function insertCourse(courseInsertable: Insertable<Course>) {
  return kysely.insertInto('course').values(courseInsertable).returningAll().executeTakeFirstOrThrow()
}

function insertLesson(lessonInsertable: Insertable<Lesson>) {
  return kysely.insertInto('lesson').values(lessonInsertable).returningAll().executeTakeFirstOrThrow()
}
