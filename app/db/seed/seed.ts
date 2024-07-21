import { Insertable, sql } from "kysely";
import { Course, EndeavorDB, kysely, Lesson, Teacher } from "../kysely";
import { teachers, courses } from "./data";

/*
 * We insert rows individually in several places, instead of using PostgreSQL bulk insertion.
 * This approach more closely mimics actual user operations and makes working with foreign keys easier.
 * So, for the sake of readability and maintainability, we sacrifice some performance gain.
 */

truncateTables()
  .then(() => {
    insertTeachers(teachers);
  })
  .then(() => {
    courses.forEach((course) => {
      const { lessons, ...courseInsertable } = course;
      insertCourse(courseInsertable).then((insertedCourse) => {
        console.log("insertedCourse: ", insertedCourse);
        //TODO: remove id, use {level, title} composite key instead
        course.id = insertedCourse.id;
        lessons?.forEach((lesson, index) => {
          lesson.course_id = course.id;
          lesson.lesson_order = index; //TODO: rename to `chapter`
          insertLesson(lesson as Insertable<Lesson>).then((insertedLesson) => {
            console.log("insertLesson: ", insertedLesson);
            lesson.id = insertedLesson.id;
          });
        });
      });
    });
  });

function truncateTables() {
  const snippet = sql`
    TRUNCATE TABLE lesson CASCADE;
    TRUNCATE TABLE course CASCADE;
    TRUNCATE TABLE teacher CASCADE;
  `;
  return snippet.execute(kysely);
}

function insertTeachers(teacherInsertable: Insertable<Teacher>[]) {
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
