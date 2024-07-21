import { Insertable } from "kysely";
import { Course, kysely } from "../kysely";
import { teachers, courses } from "./data";

//kysely.insertInto("teacher").values(teachers).execute();

const courseInsertables = courses.map((course) => course.courseInsertable);
insertCourses(courseInsertables).then((insertedCourses) => {
  console.log("Course: ", insertedCourses);
  const courseIds = insertedCourses.map((course) => course.id);
  console.log("Course ids: ", courseIds);

  courses.forEach((course, index) => {
    course.courseId = courseIds[index];
  });
  console.log("Updated courses: ", courses);

  
});

function insertCourses(courseInsertables: Insertable<Course>[]) {
  return kysely
    .insertInto("course")
    .values(courseInsertables)
    .returningAll()
    .execute();
}
