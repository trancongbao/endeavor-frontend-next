import { Insertable } from "kysely";
import { Course, kysely, Lesson } from "../kysely";
import { teachers, courses } from "./data";

//kysely.insertInto("teacher").values(teachers).execute();

const courseInsertables: Insertable<Course>[] = courses.map(
  ({ lessons, ...courseInsertable }) => courseInsertable
);
insertCourses(courseInsertables).then((insertedCourses) => {
  console.log("Course: ", insertedCourses);
  const courseIds = insertedCourses.map((course) => course.id);
  console.log("Course ids: ", courseIds);

  courses.forEach((course, index) => {
    course.id = courseIds[index];
    course.lessons?.forEach((lesson, index) => {
      lesson.course_id = course.id;
      lesson.lesson_order = index;
    });
  });
  console.log("Updated courses: ", courses);
  
  const lessonInsertables = courses.map((course) => course.lessons).flat().filter(lessons => lessons !== undefined) as Insertable<Lesson>[];
  console.log("lessonInsertables: ", lessonInsertables);

  insertLessons(lessonInsertables).then(insertedLessons => {
    console.log("Inserted lessons: ", insertedLessons)
  })
});

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
