import { Generated, Insertable, sql } from "kysely";
import { Course, EndeavorDB, kysely, Lesson, Teacher } from "../kysely";
import { teachers, courses } from "./data";

/*
 * We insert rows individually in several places, instead of using PostgreSQL bulk insertion.
 * This approach more closely mimics actual user operations and makes working with foreign keys easier.
 * So, for the sake of readability and maintainability, we sacrifice some performance gain.
 */

truncateTables()
  .then(() => {
    const teacherPromise = insertTeacher(teachers); // Promise of `insertTeacher`
    // Promises of `insertCourse`s
    const coursePromises = courses.map((course) => {
      const { lessons, ...courseInsertable } = course;
      return insertCourse(courseInsertable).then((insertedCourse) => {
        console.log("insertedCourse: ", insertedCourse);
        //TODO: remove id, use {level, title} composite key instead
        course.id = insertedCourse.id;
        const lessonPromises = lessons?.map((lesson, index) => {
          lesson.course_id = course.id;
          lesson.lesson_order = index; //TODO: rename to `chapter`
          return insertLesson(lesson as Insertable<Lesson>).then(
            (insertedLesson) => {
              console.log("insertLesson: ", insertedLesson);
              lesson.id = insertedLesson.id as unknown as Generated<number>;
            }
          );
        });
        return Promise.all(lessonPromises || []);
      });
    });
    // Combine teacherPromise with coursePromises
    return Promise.all([teacherPromise, ...coursePromises]);
  })
  .then(() => {
    console.log(
      "lessons: ",
      courses.map((course) => course.lessons)
    );
  });

function truncateTables() {
  const snippet = sql`
    TRUNCATE TABLE lesson CASCADE;
    TRUNCATE TABLE course CASCADE;
    TRUNCATE TABLE teacher CASCADE;
  `;
  return snippet.execute(kysely);
}

function insertTeacher(teacherInsertable: Insertable<Teacher>[]) {
  return kysely
    .insertInto("teacher")
    .values(teacherInsertable)
    .returningAll()
    .executeTakeFirstOrThrow();
}

function insertCourse(courseInsertable: Insertable<Course>) {
  return kysely
    .insertInto("course")
    .values(courseInsertable)
    .returningAll()
    .executeTakeFirstOrThrow();
}

function insertLesson(lessonInsertable: Insertable<Lesson>) {
  return kysely
    .insertInto("lesson")
    .values(lessonInsertable)
    .returningAll()
    .executeTakeFirstOrThrow();
}
