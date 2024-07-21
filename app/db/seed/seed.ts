import { Insertable, sql } from "kysely";
import { Course, EndeavorDB, kysely, Lesson, Teacher } from "../kysely";
import { teachers, courses } from "./data";

truncateTables()
  .then(() => {
    return insertTeachers(teachers);
  })
  .then(() => {
    const courseInsertables: Insertable<Course>[] = courses.map(
      ({ lessons, ...courseInsertable }) => courseInsertable
    );

    return insertCourses(courseInsertables);
  })
  .then((insertedCourses) => {
    console.log("Courses: ", insertedCourses);
    const courseIds = insertedCourses.map((course) => course.id);
    console.log("Course ids: ", courseIds);

    courses.forEach((course, index) => {
      course.id = courseIds[index];
      course.lessons?.forEach((lesson, lessonIndex) => {
        lesson.course_id = course.id;
        lesson.lesson_order = lessonIndex;
      });
    });

    console.log("Updated courses: ", courses);

    const lessonInsertables = courses
      .map((course) => course.lessons)
      .flat()
      .filter((lesson) => lesson !== undefined) as Insertable<Lesson>[];

    console.log("lessonInsertables: ", lessonInsertables);

    return insertLessons(lessonInsertables);
  })
  .then((insertedLessons) => {
    console.log("Inserted lessons: ", insertedLessons);
  });

function truncateTables() {
  const snippet = sql`
    TRUNCATE TABLE lesson CASCADE;
    TRUNCATE TABLE course CASCADE;
    TRUNCATE TABLE teacher CASCADE;
  `;
  return snippet.execute(kysely);
}

function insertTeachers(teacherInsertables: Insertable<Teacher>[]) {
  return kysely
    .insertInto("teacher")
    .values(teacherInsertables)
    .returningAll()
    .execute();
}

function insertCourses(courseInsertables: Insertable<Course>[]) {
  return kysely
    .insertInto("course")
    .values(courseInsertables)
    .returningAll()
    .execute();
}

function insertLessons(lessonInsertables: Insertable<Lesson>[]) {
  return kysely
    .insertInto("lesson")
    .values(lessonInsertables)
    .returningAll()
    .execute();
}
